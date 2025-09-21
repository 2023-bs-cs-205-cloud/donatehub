import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { amount, campaign_id, donor_name, donor_email, message, is_anonymous } = body

    // Validate required fields
    if (!amount || !campaign_id || !donor_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate amount
    if (Number.parseFloat(amount) <= 0) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 })
    }

    // Check if campaign exists and is active
    const { data: campaign, error: campaignError } = await supabase
      .from("campaigns")
      .select("id, status, end_date")
      .eq("id", campaign_id)
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign.status !== "active" || new Date(campaign.end_date) < new Date()) {
      return NextResponse.json({ error: "Campaign is not active" }, { status: 400 })
    }

    // Create donation record
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        amount: Number.parseFloat(amount),
        donor_id: user.id,
        campaign_id,
        donor_name: is_anonymous ? "Anonymous" : donor_name,
        donor_email,
        message: message || null,
        is_anonymous: is_anonymous || false,
        payment_status: "completed", // In a real app, this would be handled by payment processor
      })
      .select()
      .single()

    if (donationError) {
      return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
    }

    return NextResponse.json({ success: true, donation })
  } catch (error) {
    console.error("Donation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get("campaign_id")

    let query = supabase
      .from("donations")
      .select(
        `
        *,
        campaigns (
          title,
          profiles (
            organization_name,
            full_name
          )
        )
      `,
      )
      .eq("donor_id", user.id)
      .order("created_at", { ascending: false })

    if (campaignId) {
      query = query.eq("campaign_id", campaignId)
    }

    const { data: donations, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
    }

    return NextResponse.json({ donations })
  } catch (error) {
    console.error("Donations fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
