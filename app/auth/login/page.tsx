"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { loginAction } from "./actions"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const urlError = searchParams.get("error")
    if (urlError === "profile_not_found") {
      setError("Your account profile was not found. Please contact support or try signing up again.")
    }
  }, [searchParams])

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting login process...")
      const result = await loginAction(formData)

      if (result?.error) {
        console.log("[v0] Login error:", result.error)
        setError(result.error)
      }
      // If successful, the server action will redirect automatically
    } catch (error: unknown) {
      console.log("[v0] Unexpected error:", error)
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
            <CardTitle className="text-3xl font-bold text-blue-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">Sign in to your DonateHub account</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="your@email.com" required className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required className="w-full" />
              </div>
              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
