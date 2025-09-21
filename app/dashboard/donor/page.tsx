import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Heart, TrendingUp, Calendar, Search, Eye } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/logout-button"

export default async function DonorDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Verify user is donor
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.user_type !== "donor") {
    redirect("/dashboard/ngo")
  }

  // Get donor's donations
  const { data: donations } = await supabase
    .from("donations")
    .select(
      `
      *,
      campaigns (
        id,
        title,
        goal_amount,
        current_amount,
        category,
        status,
        profiles (
          organization_name,
          full_name
        )
      )
    `,
    )
    .eq("donor_id", user.id)
    .order("created_at", { ascending: false })

  // Get recommended campaigns (active campaigns not donated to)
  const donatedCampaignIds = donations?.map((d) => d.campaign_id) || []
  let recommendedQuery = supabase
    .from("campaigns")
    .select(
      `
      *,
      profiles!campaigns_ngo_id_fkey (
        full_name,
        organization_name
      )
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(6)

  if (donatedCampaignIds.length > 0) {
    recommendedQuery = recommendedQuery.not("id", "in", `(${donatedCampaignIds.join(",")})`)
  }

  const { data: recommendedCampaigns } = await recommendedQuery

  // Calculate statistics
  const totalDonated = donations?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0
  const campaignsSupported = new Set(donations?.map((d) => d.campaign_id)).size || 0
  const totalDonations = donations?.length || 0
  const avgDonation = totalDonations > 0 ? totalDonated / totalDonations : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile.full_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/campaigns">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Discover Campaigns
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Donated</p>
                  <p className="text-2xl font-bold text-green-600">${totalDonated.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Campaigns Supported</p>
                  <p className="text-2xl font-bold text-blue-600">{campaignsSupported}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Donations</p>
                  <p className="text-2xl font-bold text-purple-600">{totalDonations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Donation</p>
                  <p className="text-2xl font-bold text-orange-600">${avgDonation.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Donations */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Donations</CardTitle>
              <Link href="/donations/history">
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {donations && donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.slice(0, 5).map((donation) => (
                    <div key={donation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Link
                            href={`/campaigns/${donation.campaigns.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 line-clamp-1"
                          >
                            {donation.campaigns.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">
                            by {donation.campaigns.profiles.organization_name || donation.campaigns.profiles.full_name}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{donation.campaigns.category}</Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {donation.message && (
                            <p className="text-sm text-gray-700 mt-2 italic">"{donation.message}"</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-green-600">${donation.amount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
                  <Link href="/campaigns">
                    <Button className="bg-blue-600 hover:bg-blue-700">Discover Campaigns</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedCampaigns && recommendedCampaigns.length > 0 ? (
                <div className="space-y-4">
                  {recommendedCampaigns.slice(0, 3).map((campaign) => {
                    const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100
                    const daysLeft = Math.ceil(
                      (new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )

                    return (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <Link
                              href={`/campaigns/${campaign.id}`}
                              className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
                            >
                              {campaign.title}
                            </Link>
                            <p className="text-sm text-gray-600 mt-1">
                              by {campaign.profiles.organization_name || campaign.profiles.full_name}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline">{campaign.category}</Badge>
                              <span className="text-xs text-gray-500">
                                {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>${campaign.current_amount.toLocaleString()}</span>
                            <span className="text-gray-500">of ${campaign.goal_amount.toLocaleString()}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{Math.round(progressPercentage)}% funded</span>
                            <Link href={`/campaigns/${campaign.id}`}>
                              <Button size="sm" variant="outline" className="bg-transparent">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <Link href="/campaigns">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Campaigns
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No new campaigns to recommend.</p>
                  <Link href="/campaigns">
                    <Button className="bg-blue-600 hover:bg-blue-700">Browse All Campaigns</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Impact Summary */}
        {donations && donations.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">${totalDonated.toLocaleString()}</div>
                  <p className="text-sm text-gray-600">Total contributed to causes</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{campaignsSupported}</div>
                  <p className="text-sm text-gray-600">Different campaigns supported</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {donations.filter((d) => d.campaigns.status === "completed").length}
                  </div>
                  <p className="text-sm text-gray-600">Campaigns helped complete</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-gray-700 mb-4">
                  Thank you for making a difference! Your generosity has helped support important causes and create
                  positive change in communities.
                </p>
                <Link href="/campaigns">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Heart className="w-4 h-4 mr-2" />
                    Continue Making Impact
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
