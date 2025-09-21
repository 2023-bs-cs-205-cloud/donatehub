import { createClient } from "@/lib/supabase/server"
import { EditCampaignForm } from "@/components/edit-campaign-form"
import { redirect, notFound } from "next/navigation"

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get campaign and verify ownership
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("ngo_id", user.id)
    .single()

  if (campaignError || !campaign) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Campaign</h1>
            <p className="text-gray-600">Update your campaign details</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <EditCampaignForm campaign={campaign} />
          </div>
        </div>
      </div>
    </div>
  )
}
