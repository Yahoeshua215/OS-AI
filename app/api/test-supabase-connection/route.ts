import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { url, key } = await request.json()

    if (!url || !key) {
      return NextResponse.json({ error: "URL and API key are required" }, { status: 400 })
    }

    // Create a test client
    const supabase = createClient(url, key)

    // Try a simple query to test the connection
    const { data, error } = await supabase.from("push_notification_templates").select("count()", { count: "exact" })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, count: data })
  } catch (error) {
    console.error("Error testing Supabase connection:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to connect to Supabase" },
      { status: 500 },
    )
  }
}
