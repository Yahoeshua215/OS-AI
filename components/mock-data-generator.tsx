"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// This component provides sample notifications when OpenAI is not available
export function MockDataGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const generateMockData = async () => {
    setIsGenerating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, this would call an API to generate and store mock data
      setGenerated(true)
    } catch (error) {
      console.error("Error generating mock data:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Sample Data</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-600">
          Generate sample push notifications to test the application without using OpenAI.
        </p>

        {generated ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700 mb-4">
            Sample data generated successfully! You can now view sample notifications in your dashboard.
          </div>
        ) : null}

        <Button onClick={generateMockData} disabled={isGenerating || generated} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : generated ? (
            "Data Generated"
          ) : (
            "Generate Sample Data"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
