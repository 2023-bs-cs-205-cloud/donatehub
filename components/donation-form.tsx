"use client"

import type React from "react"
import { Badge } from "@/components/ui/badge" // Import Badge component

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, CreditCard } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface DonationFormProps {
  campaignId: string
}

export function DonationForm({ campaignId }: DonationFormProps) {
  const [amount, setAmount] = useState("")
  const [donorName, setDonorName] = useState("")
  const [donorEmail, setDonorEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const quickAmounts = [25, 50, 100, 250, 500]

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Please log in to make a donation")

      const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

      if (!profile || profile.user_type !== "donor") {
        throw new Error("Only individual donors can make donations. Organizations cannot donate.")
      }

      // Validate amount
      const donationAmount = Number.parseFloat(amount)
      if (donationAmount <= 0) {
        throw new Error("Please enter a valid donation amount")
      }

      console.log("[v0] Starting fake payment processing...")

      // Simulate payment processing delay (1-3 seconds)
      const processingDelay = Math.random() * 2000 + 1000
      await new Promise((resolve) => setTimeout(resolve, processingDelay))

      // Simulate payment success (always succeeds for demo)
      const fakeTransactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log("[v0] Fake payment processed successfully:", fakeTransactionId)

      const { error } = await supabase.from("donations").insert({
        amount: donationAmount,
        donor_id: user.id,
        campaign_id: campaignId,
        donor_name: isAnonymous ? "Anonymous" : donorName,
        donor_email: donorEmail,
        message: message || null,
        is_anonymous: isAnonymous,
        payment_status: "completed", // FAKE: Always mark as completed for demo
        payment_reference: fakeTransactionId,
      })

      if (error) throw error

      console.log("[v0] Donation record created successfully")

      // Redirect to success page
      router.push(`/donations/success?amount=${donationAmount}&campaign=${campaignId}&transaction=${fakeTransactionId}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Make a Donation
          <Badge variant="secondary" className="text-xs">
            Donors Only
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Amount Buttons */}
          <div className="space-y-2">
            <Label>Quick Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  type="button"
                  variant={amount === quickAmount.toString() ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="text-sm"
                >
                  ${quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              required
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Donor Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              <Label htmlFor="anonymous" className="text-sm">
                Make this donation anonymous
              </Label>
            </div>

            {!isAnonymous && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="donorName">Your Name</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Enter your name"
                    required={!isAnonymous}
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="donorEmail">Email Address</Label>
              <Input
                id="donorEmail"
                type="email"
                placeholder="your@email.com"
                required
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoading ? "Processing Payment (DEMO)..." : `Donate $${amount || "0"} (DEMO)`}
          </Button>

          <div className="space-y-1">
            <p className="text-xs text-gray-500 text-center">
              🎭 DEMO MODE: No real payment will be processed. This is a simulation for testing purposes.
            </p>
            <p className="text-xs text-blue-600 text-center font-medium">
              ℹ️ Only individual donor accounts can make donations to campaigns.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
