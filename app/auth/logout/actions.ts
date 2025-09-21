"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function logoutAction() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.log("[v0] Logout error:", error.message)
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/auth/login")
}
