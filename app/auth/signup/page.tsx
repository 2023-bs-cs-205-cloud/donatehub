"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [userType, setUserType] = useState<"donor" | "ngo">("donor")
  const [organizationName, setOrganizationName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    if (userType === "ngo" && !organizationName.trim()) {
      setError("Organization name is required for NGO accounts")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          full_name: fullName,
          user_type: userType,
          organization_name: userType === "ngo" ? organizationName : null,
        },
      })

      if (error) {
        // Fallback to regular signup if admin method fails
        console.log("Admin signup failed, trying regular signup:", error)

        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType,
              organization_name: userType === "ngo" ? organizationName : null,
            },
          },
        })

        if (signupError) {
          if (signupError.message.includes("email_address_invalid")) {
            setError("Please enter a valid email address")
          } else if (signupError.message.includes("User already registered")) {
            setError("An account with this email already exists. Please try logging in instead.")
          } else {
            setError(signupError.message)
          }
          return
        }

        // For regular signup, try to sign in immediately
        if (signupData.user) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (signInError) {
            setError("Account created but automatic login failed. Please try logging in manually.")
            router.push("/auth/login")
            return
          }
        }
      }

      if (userType === "donor") {
        window.location.href = "/dashboard/donor"
      } else {
        window.location.href = "/dashboard/ngo"
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-blue-900">Join DonateHub</CardTitle>
            <CardDescription className="text-gray-600">
              Create your account to start making a difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userType">Account Type</Label>
                <Select value={userType} onValueChange={(value: "donor" | "ngo") => setUserType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donor">Individual Donor</SelectItem>
                    <SelectItem value="ngo">NGO/Organization</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-md">
                  {userType === "donor" ? (
                    <div>
                      <p className="font-medium text-blue-800 mb-1">Individual Donor Account:</p>
                      <p>• Make donations to support campaigns</p>
                      <p>• Track your donation history and impact</p>
                      <p>• Discover new causes to support</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-blue-800 mb-1">NGO/Organization Account:</p>
                      <p>• Create and manage fundraising campaigns</p>
                      <p>• Receive donations from individual donors</p>
                      <p>• Track campaign progress and donor engagement</p>
                      <p className="text-amber-700 font-medium mt-2">
                        ⚠️ Note: Organizations cannot make donations, only receive them
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {userType === "ngo" && (
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    type="text"
                    placeholder="Your organization name"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
