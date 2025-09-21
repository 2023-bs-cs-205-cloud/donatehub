import { createClient } from "@/lib/supabase/server"
import { CampaignForm } from "@/components/campaign-form"
import { redirect } from "next/navigation"

export default async function CreateCampaignPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Check if user is an NGO
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (!profile || profile.user_type !== "ngo") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Campaign</h1>
            <p className="text-gray-600">Share your cause and start raising funds for your mission</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <CampaignForm />
          </div>
        </div>
      </div>
    </div>
  )
}
