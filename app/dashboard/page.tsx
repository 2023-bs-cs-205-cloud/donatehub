import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  let profile = null
  let attempts = 0
  const maxAttempts = 3

  while (!profile && attempts < maxAttempts) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("user_type, full_name, organization_name")
      .eq("id", user.id)
      .single()

    if (profileData) {
      profile = profileData
      break
    }

    if (profileError && !profileError.message.includes("PGRST116")) {
      // If it's not a "not found" error, break
      break
    }

    attempts++
    if (attempts < maxAttempts) {
      // Wait a bit before retrying
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  if (!profile) {
    redirect("/auth/login?error=profile_not_found")
  }

  if (profile.user_type === "ngo") {
    redirect("/dashboard/ngo")
  } else {
    redirect("/dashboard/donor")
  }
}
