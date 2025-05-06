import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for a settings page
  if (request.nextUrl.pathname.startsWith("/settings")) {
    // Redirect to the home page
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only run middleware on settings routes
  matcher: "/settings/:path*",
}
