"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { JourneyCanvas } from "@/components/journey-canvas"

export default function JourneyEditorPage() {
  const router = useRouter()
  const [journeyData, setJourneyData] = useState<{
    name: string
    nodes: any[]
    description: string
  } | null>(null)

  useEffect(() => {
    // Load journey data from localStorage
    const savedJourney = localStorage.getItem("generatedJourney")
    if (savedJourney) {
      try {
        setJourneyData(JSON.parse(savedJourney))
      } catch (e) {
        console.error("Error parsing journey data:", e)
      }
    }
  }, [])

  if (!journeyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No journey data found</h2>
          <Button onClick={() => router.push("/journeys")}>Return to Journeys</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Demo Paid Org</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>ALL DEMO Testing</span>
          </div>
          <h1 className="text-2xl font-bold">{journeyData.name}</h1>
          <div className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded mt-1">Draft</div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" className="bg-white text-[#4954e6] border border-[#4954e6] hover:bg-gray-50">
            <Save className="h-4 w-4 mr-2" />
            Save & Close
          </Button>
          <Button className="bg-gray-300 hover:bg-gray-400 text-gray-700">Set Live</Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <JourneyCanvas nodes={journeyData.nodes} />
      </div>
    </div>
  )
}
