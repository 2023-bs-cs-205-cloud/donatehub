import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Target, TrendingUp, Users, Plus, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LogoutButton } from "@/components/logout-button"

export default async function NGODashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Verify user is NGO
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.user_type !== "ngo") {
    redirect("/dashboard/donor")
  }

  // Get NGO campaigns
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("ngo_id", user.id)
    .order("created_at", { ascending: false })

  // Get donations for NGO campaigns
  const { data: donations } = await supabase
    .from("donations")
    .select(
      `
      *,
      campaigns!inner (
        ngo_id,
        title
      )
    `,
    )
    .eq("campaigns.ngo_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Calculate statistics
  const totalRaised = campaigns?.reduce((sum, campaign) => sum + Number(campaign.current_amount), 0) || 0
  const totalGoal = campaigns?.reduce((sum, campaign) => sum + Number(campaign.goal_amount), 0) || 0
  const activeCampaigns = campaigns?.filter((c) => c.status === "active").length || 0
  const totalDonors = new Set(donations?.map((d) => d.donor_id)).size || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile.organization_name || profile.full_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/campaigns/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
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
                  <p className="text-sm text-gray-600">Total Raised</p>
                  <p className="text-2xl font-bold text-green-600">${totalRaised.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Goal</p>
                  <p className="text-2xl font-bold text-blue-600">${totalGoal.toLocaleString()}</p>
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
                  <p className="text-sm text-gray-600">Active Campaigns</p>
                  <p className="text-2xl font-bold text-purple-600">{activeCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Donors</p>
                  <p className="text-2xl font-bold text-orange-600">{totalDonors}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Your Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              {campaigns && campaigns.length > 0 ? (
                <div className="space-y-4">
                  {campaigns.slice(0, 5).map((campaign) => {
                    const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100
                    const daysLeft = Math.ceil(
                      (new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )

                    return (
                      <div key={campaign.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 line-clamp-1">{campaign.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                                {campaign.status}
                              </Badge>
                              <span className="text-sm text-gray-500">{campaign.category}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Link href={`/campaigns/${campaign.id}`}>
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/dashboard/ngo/campaigns/${campaign.id}/edit`}>
                              <Button size="sm" variant="ghost">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>${campaign.current_amount.toLocaleString()}</span>
                            <span className="text-gray-500">of ${campaign.goal_amount.toLocaleString()}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{Math.round(progressPercentage)}% funded</span>
                            <span>{daysLeft > 0 ? `${daysLeft} days left` : "Ended"}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {campaigns.length > 5 && (
                    <Link href="/dashboard/ngo/campaigns">
                      <Button variant="outline" className="w-full bg-transparent">
                        View All Campaigns
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">You haven't created any campaigns yet.</p>
                  <Link href="/campaigns/create">
                    <Button className="bg-blue-600 hover:bg-blue-700">Create Your First Campaign</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Donations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              {donations && donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation) => (
                    <div key={donation.id} className="flex justify-between items-start border-b pb-3 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {donation.is_anonymous ? "Anonymous" : donation.donor_name}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-1">{donation.campaigns.title}</p>
                        <p className="text-xs text-gray-500">{new Date(donation.created_at).toLocaleDateString()}</p>
                        {donation.message && <p className="text-xs text-gray-700 mt-1 italic">"{donation.message}"</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">${donation.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No donations received yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
