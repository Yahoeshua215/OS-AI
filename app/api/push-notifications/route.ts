import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("push_notification_templates")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ templates: data })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { title, body: content, category, tags } = body

  const { data, error } = await supabase
    .from("push_notification_templates")
    .insert([{ title, body: content, category, tags }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ template: data[0] })
}
