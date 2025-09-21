import { createClient } from "@/lib/supabase/server"
import { CampaignCard } from "@/components/campaign-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query with filters
  let query = supabase
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

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  const { data: campaigns, error } = await query

  if (error) {
    console.error("Error fetching campaigns:", error)
    return <div>Error loading campaigns</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Active Campaigns</h1>
          <p className="text-lg text-gray-600">Discover and support meaningful causes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search campaigns..." className="pl-10" defaultValue={params.search} name="search" />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select defaultValue={params.category || "all"} name="category">
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                  <SelectItem value="Environment">Environment</SelectItem>
                  <SelectItem value="Animals">Animals</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Filter
            </Button>
          </div>
        </div>

        {/* Campaigns Grid */}
        {campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No campaigns found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
