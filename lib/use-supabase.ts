"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

// Create a flag to track if Supabase has been configured globally
let isSupabaseConfigured = false

export function useSupabase(skipConfigCheck = false) {
  const [supabase, setSupabase] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured || skipConfigCheck)

  useEffect(() => {
    // If Supabase is already configured globally or we're skipping the check, return early
    if (isSupabaseConfigured || skipConfigCheck) {
      setIsConfigured(true)
      setIsLoading(false)
      return
    }

    // Try to get credentials from localStorage
    const url = localStorage.getItem("SUPABASE_URL")
    const key = localStorage.getItem("SUPABASE_KEY")

    if (url && key) {
      try {
        const client = createClient(url, key)
        setSupabase(client)
        setIsConfigured(true)
        // Set the global flag to true
        isSupabaseConfigured = true
        setError(null)
      } catch (err) {
        setError("Failed to initialize Supabase client")
        console.error(err)
      }
    } else {
      setError("Supabase credentials not found")
    }

    setIsLoading(false)
  }, [skipConfigCheck])

  return { supabase, isLoading, error, isConfigured }
}
