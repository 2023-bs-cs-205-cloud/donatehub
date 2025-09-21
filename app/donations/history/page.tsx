import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DonationHistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user's donation history
  const { data: donations, error: donationsError } = await supabase
    .from("donations")
    .select(
      `
      *,
      campaigns (
        id,
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

  if (donationsError) {
    console.error("Error fetching donations:", donationsError)
  }

  const totalDonated = donations?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donation History</h1>
          <p className="text-gray-600">Track your contributions and impact</p>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-2xl font-bold text-blue-600">
                    {new Set(donations?.map((d) => d.campaign_id)).size || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Donations</p>
                  <p className="text-2xl font-bold text-purple-600">{donations?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {donations && donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          href={`/campaigns/${donation.campaigns.id}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {donation.campaigns.title}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          by {donation.campaigns.profiles.organization_name || donation.campaigns.profiles.full_name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                          <Badge variant={donation.payment_status === "completed" ? "default" : "secondary"}>
                            {donation.payment_status}
                          </Badge>
                          {donation.is_anonymous && <Badge variant="outline">Anonymous</Badge>}
                        </div>
                        {donation.message && <p className="text-sm text-gray-700 mt-2 italic">"{donation.message}"</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">${donation.amount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven't made any donations yet.</p>
                <Link
                  href="/campaigns"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Discover Campaigns
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
