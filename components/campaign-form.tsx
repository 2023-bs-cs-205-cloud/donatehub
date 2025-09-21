"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function CampaignForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goalAmount, setGoalAmount] = useState("")
  const [category, setCategory] = useState("")
  const [endDate, setEndDate] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data, error } = await supabase
        .from("campaigns")
        .insert({
          title,
          description,
          goal_amount: Number.parseFloat(goalAmount),
          category,
          end_date: endDate,
          image_url: imageUrl || "/placeholder.svg?height=400&width=600",
          ngo_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/campaigns/${data.id}`)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter a compelling campaign title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your campaign, its goals, and how donations will be used"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goalAmount">Goal Amount ($)</Label>
          <Input
            id="goalAmount"
            type="number"
            placeholder="10000"
            required
            min="1"
            step="0.01"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="Environment">Environment</SelectItem>
              <SelectItem value="Animals">Animals</SelectItem>
              <SelectItem value="Community">Community</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          required
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
        {isLoading ? "Creating Campaign..." : "Create Campaign"}
      </Button>
    </form>
  )
}
