"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.log("[v0] Login error:", error.message)
    if (error.message.includes("invalid_credentials")) {
      return { error: "Invalid email or password. Please check your credentials and try again." }
    }
    return { error: error.message }
  }

  if (data.user) {
    console.log("[v0] User authenticated, redirecting to dashboard...")
    revalidatePath("/", "layout")
    redirect("/dashboard")
  }

  return { error: "Login failed" }
}
