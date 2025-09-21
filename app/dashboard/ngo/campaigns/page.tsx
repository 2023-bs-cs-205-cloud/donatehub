import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Eye, Edit, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function NGOCampaignsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Verify user is NGO
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (!profile || profile.user_type !== "ngo") {
    redirect("/dashboard/donor")
  }

  // Get all NGO campaigns
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("ngo_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-gray-600">Manage all your fundraising campaigns</p>
          </div>
          <Link href="/campaigns/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Grid */}
        {campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const progressPercentage = (campaign.current_amount / campaign.goal_amount) * 100
              const daysLeft = Math.ceil(
                (new Date(campaign.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )

              return (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{campaign.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline">{campaign.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{campaign.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">${campaign.current_amount.toLocaleString()}</span>
                        <span className="text-gray-500">of ${campaign.goal_amount.toLocaleString()}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(progressPercentage)}% funded</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/ngo/campaigns/${campaign.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">Create your first campaign to start raising funds for your cause.</p>
              <Link href="/campaigns/create">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
