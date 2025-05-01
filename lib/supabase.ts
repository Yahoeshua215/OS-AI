import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

export type PushNotificationTemplate = {
  id: string
  title: string
  body: string
  category: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export type PushNotification = {
  id: string
  title: string
  body: string
  status: string
  scheduled_at: string | null
  sent_at: string | null
  delivered_count: number
  click_count: number
  ctr: number | null
  template_id: string | null
  created_at: string
  updated_at: string
}
