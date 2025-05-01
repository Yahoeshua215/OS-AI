"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, AlertCircle, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { SegmentFilter } from "@/types/segment-types"

interface AISegmentGeneratorProps {
  onGenerateFilters: (filters: SegmentFilter[]) => void
  onClose: () => void
}

export function AISegmentGenerator({ onGenerateFilters, onClose }: AISegmentGeneratorProps) {
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null)

  const generateSegment = async () => {
    if (!description.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      // In a real implementation, this would call an API to generate segment filters
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate filters based on the description
      let filters: SegmentFilter[] = []

      if (description.toLowerCase().includes("active users")) {
        filters = [
          {
            id: "last-session",
            type: "Last Session",
            operator: "is less than",
            value: "7",
            unit: "days ago",
          },
          {
            id: "session-count",
            type: "Session Count",
            operator: "is greater than",
            value: "3",
          },
        ]
        setGeneratedResponse(
          "I've created a segment for active users who have opened your app in the last 7 days and have at least 3 sessions.",
        )
      } else if (description.toLowerCase().includes("purchased") || description.toLowerCase().includes("buy")) {
        filters = [
          {
            id: "purchased-item",
            type: "Purchased Item",
            operator: "exists",
          },
          {
            id: "amount-spent",
            type: "Amount Spent",
            operator: "is greater than",
            value: "0",
          },
        ]
        setGeneratedResponse("I've created a segment for users who have made at least one purchase in your app.")
      } else if (description.toLowerCase().includes("english")) {
        filters = [
          {
            id: "language",
            type: "Language",
            operator: "is",
            value: "English",
          },
        ]
        setGeneratedResponse("I've created a segment for users who have their device language set to English.")
      } else if (description.toLowerCase().includes("notification") || description.toLowerCase().includes("message")) {
        filters = [
          {
            id: "message-event",
            type: "Message Event",
            messageType: "Any push notification",
            operator: "has been received",
            count: "at least",
            value: "1",
            timeframe: "within",
            timeValue: "7",
            timeUnit: "days",
          },
        ]
        setGeneratedResponse(
          "I've created a segment for users who have received at least one push notification in the last 7 days.",
        )
      } else {
        // Default segment for new users
        filters = [
          {
            id: "first-session",
            type: "First Session",
            operator: "is less than",
            value: "30",
            unit: "days ago",
          },
        ]
        setGeneratedResponse(
          "Based on your description, I've created a segment for new users who joined in the last 30 days. You can refine this further in the segment builder.",
        )
      }

      onGenerateFilters(filters)
    } catch (err) {
      console.error("Error generating segment:", err)
      setError("Failed to generate segment. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-medium">Describe your target audience</h3>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Tell us who you want to target</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Active users who have opened the app in the last week, Users who have received push notifications, English-speaking users who have made a purchase"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Examples (click to use):</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Active users in the last 7 days",
                      "Users who have received push notifications",
                      "English-speaking users",
                      "Users who have made a purchase",
                      "New users who joined recently",
                    ].map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setDescription(example)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={generateSegment}
                disabled={isGenerating || !description.trim()}
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Segment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {generatedResponse && (
          <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
            <div className="flex items-start">
              <Sparkles className="h-5 w-5 text-pink-500 mt-0.5 mr-2" />
              <div className="flex-1">
                <p className="text-gray-700">{generatedResponse}</p>
                <div className="flex justify-end mt-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Was this helpful?</span>
                    <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                      <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                    </button>
                    <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                      <ThumbsDown className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
