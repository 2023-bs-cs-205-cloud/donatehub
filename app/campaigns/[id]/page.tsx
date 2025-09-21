import { createClient } from "@/lib/supabase/server"
import { DonationForm } from "@/components/donation-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar, Target, Users, Heart } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get campaign details
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      profiles!campaigns_ngo_id_fkey (
        full_name,
        organization_name,
        email
      )
    `,
    )
    .eq("id", id)
    .single()

  if (error || !campaign) {
    notFound()
  }

  // Get recent donations
  const { data: donations } = await supabase
    .from("donations")
    .select("amount, donor_name, message, created_at, is_anonymous")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100
  const daysLeft = Math.ceil((new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type, full_name, organization_name")
      .eq("id", user.id)
      .single()
    userProfile = profile
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Image */}
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={campaign.image_url || "/placeholder.svg?height=400&width=800"}
                alt={campaign.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-white/90 text-gray-800">
                  {campaign.category}
                </Badge>
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-white rounded-lg p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span>by {campaign.profiles.organization_name || campaign.profiles.full_name}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {daysLeft > 0 ? `${daysLeft} days left` : "Campaign ended"}
                </span>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{campaign.description}</p>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Recent Donations
              </h2>
              {donations && donations.length > 0 ? (
                <div className="space-y-4">
                  {donations.map((donation, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{donation.is_anonymous ? "Anonymous" : donation.donor_name}</p>
                          <p className="text-sm text-gray-600">{new Date(donation.created_at).toLocaleDateString()}</p>
                          {donation.message && <p className="text-sm text-gray-700 mt-1">"{donation.message}"</p>}
                        </div>
                        <span className="font-semibold text-green-600">${donation.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No donations yet. Be the first to support this campaign!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Campaign Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${campaign.current_amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">raised of ${campaign.goal_amount.toLocaleString()} goal</div>
                </div>

                <Progress value={progressPercentage} className="h-3" />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{Math.round(progressPercentage)}%</div>
                    <div className="text-xs text-gray-500">Funded</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{donations?.length || 0}</div>
                    <div className="text-xs text-gray-500">Donors</div>
                  </div>
                </div>

                <Separator />

                {daysLeft > 0 ? (
                  <>
                    {!user ? (
                      <div className="text-center py-4 space-y-3">
                        <p className="text-gray-600">Please log in to make a donation</p>
                        <div className="space-y-2">
                          <a
                            href="/auth/login"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                          >
                            Log In to Donate
                          </a>
                          <p className="text-xs text-gray-500">Only individual donors can make donations</p>
                        </div>
                      </div>
                    ) : userProfile?.user_type === "ngo" ? (
                      <div className="text-center py-4 space-y-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="text-amber-800">
                          <Users className="w-8 h-8 mx-auto mb-2" />
                          <p className="font-medium">Organization Account</p>
                          <p className="text-sm">
                            Organizations cannot make donations. Only individual donors can contribute to campaigns.
                          </p>
                        </div>
                        <div className="text-xs text-amber-700 bg-amber-100 p-2 rounded">
                          💡 Organizations can create and manage campaigns to receive donations from individual donors.
                        </div>
                      </div>
                    ) : userProfile?.user_type === "donor" ? (
                      <DonationForm campaignId={campaign.id} />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500">Loading donation form...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">This campaign has ended</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organization Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  About the Organization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{campaign.profiles.organization_name || campaign.profiles.full_name}</p>
                  <p className="text-sm text-gray-600">Contact: {campaign.profiles.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
