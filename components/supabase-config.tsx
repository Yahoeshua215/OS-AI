"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export function SupabaseConfig() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const testConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setStatus("error")
      setErrorMessage("Please enter both Supabase URL and API Key")
      return
    }

    setStatus("testing")

    try {
      // Store the values in localStorage for persistence
      localStorage.setItem("SUPABASE_URL", supabaseUrl)
      localStorage.setItem("SUPABASE_KEY", supabaseKey)

      // Test the connection by making a simple query
      const response = await fetch("/api/test-supabase-connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: supabaseUrl, key: supabaseKey }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to connect to Supabase")
      }

      setStatus("success")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to connect to Supabase")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Supabase Configuration</CardTitle>
        <CardDescription>Enter your Supabase URL and API Key to connect to your database.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input
            id="supabase-url"
            placeholder="https://your-project.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supabase-key">Supabase Anon Key</Label>
          <Input
            id="supabase-key"
            type="password"
            placeholder="your-anon-key"
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            You can find your API keys in the Supabase dashboard under Project Settings &gt; API.
          </p>
        </div>

        {status === "success" && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Connection Successful</AlertTitle>
            <AlertDescription className="text-green-700">
              Successfully connected to your Supabase database.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-600">Connection Failed</AlertTitle>
            <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={testConnection} disabled={status === "testing"} className="w-full">
          {status === "testing" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Connection"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
