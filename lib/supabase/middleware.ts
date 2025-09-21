import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  console.log("[v0] Middleware checking path:", request.nextUrl.pathname)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] User authenticated:", !!user)

  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    console.log("[v0] Redirecting unauthenticated user to login")
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  if (
    (request.nextUrl.pathname.startsWith("/auth/login") || request.nextUrl.pathname.startsWith("/auth/signup")) &&
    user
  ) {
    console.log("[v0] Redirecting authenticated user to dashboard")
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
