"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { JourneyCanvas } from "@/components/journey-canvas"

export default function JourneyEditorPage() {
  const params = useParams()
  const journeyId = params.id as string
  const [journeyData, setJourneyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load journey data from sessionStorage
    const data = sessionStorage.getItem(journeyId)
    if (data) {
      setJourneyData(JSON.parse(data))
    }
    setLoading(false)
  }, [journeyId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!journeyData) {
    return <div className="flex items-center justify-center h-screen">Journey not found</div>
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">{journeyData.name}</h1>
        {journeyData.description && <p className="text-gray-500 mt-1">{journeyData.description}</p>}
      </div>
      <div className="flex-1 overflow-hidden">
        <JourneyCanvas nodes={journeyData.nodes || []} useUserBehavior={journeyData.useUserBehavior || false} />
      </div>
    </div>
  )
}
