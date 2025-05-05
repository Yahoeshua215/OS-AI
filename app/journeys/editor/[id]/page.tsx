"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { JourneyCanvas } from "@/components/journey-canvas"

interface JourneyNode {
  id: string
  type: "entrance" | "wait" | "push" | "email" | "branch" | "exit"
  position?: { x: number; y: number }
  content?: {
    title?: string
    description?: string
    segments?: string[]
    excludedSegments?: string[]
    waitDuration?: string
    exitConditions?: string[]
    trigger?: string
    start?: string
  }
  connections?: string[]
  branches?: {
    yes?: string[]
    no?: string[]
  }
}

interface Journey {
  name: string
  nodes: JourneyNode[]
  description: string
}

export default function JourneyEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [journey, setJourney] = useState<Journey | null>(null)
  const [journeyName, setJourneyName] = useState("Re-engagement")

  useEffect(() => {
    // Load journey data from sessionStorage
    const journeyData = sessionStorage.getItem(params.id)
    if (journeyData) {
      try {
        const parsedJourney = JSON.parse(journeyData)

        // Ensure each node has a content property
        if (parsedJourney.nodes) {
          parsedJourney.nodes = parsedJourney.nodes.map((node: JourneyNode) => ({
            ...node,
            content: node.content || {},
          }))
        }

        setJourney(parsedJourney)
        setJourneyName(parsedJourney.name || "Re-engagement")
      } catch (error) {
        console.error("Error parsing journey data:", error)
        // Create default journey if parsing fails
        createDefaultJourney()
      }
    } else {
      // If no journey data, create a default journey
      createDefaultJourney()
    }

    function createDefaultJourney() {
      const defaultJourney: Journey = {
        name: "Re-engagement",
        description: "",
        nodes: [
          {
            id: "entrance-1",
            type: "entrance",
            content: {
              trigger: "Audience Segment",
              start: "Immediately",
            },
            connections: ["push-1"],
          },
          {
            id: "push-1",
            type: "push",
            content: {
              title: "Welcome back!",
            },
            connections: ["wait-1"],
          },
          {
            id: "wait-1",
            type: "wait",
            content: {
              waitDuration: "3 Days",
            },
            connections: ["branch-1"],
          },
          {
            id: "branch-1",
            type: "branch",
            content: {
              title: "Yes/No Branch",
            },
            branches: {
              yes: ["push-2"],
              no: ["email-1"],
            },
          },
          {
            id: "push-2",
            type: "push",
            content: {
              title: "Follow-up push",
            },
            connections: ["exit-1"],
          },
          {
            id: "email-1",
            type: "email",
            content: {
              title: "Follow-up email",
            },
            connections: ["exit-1"],
          },
          {
            id: "exit-1",
            type: "exit",
            content: {
              exitConditions: [
                "User has received all messages",
                "User becomes active",
                "User no longer matches audience conditions",
              ],
            },
          },
        ],
      }
      setJourney(defaultJourney)
      setJourneyName(defaultJourney.name)
      sessionStorage.setItem(params.id, JSON.stringify(defaultJourney))
    }
  }, [params.id])

  const handleNodesChange = (updatedNodes: JourneyNode[]) => {
    if (!journey) return

    const updatedJourney = { ...journey, nodes: updatedNodes }
    setJourney(updatedJourney)
    sessionStorage.setItem(params.id, JSON.stringify(updatedJourney))
  }

  const handleSaveAndClose = () => {
    router.push("/journeys")
  }

  if (!journey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Demo Paid Org</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>ALL DEMO Testing</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Journeys</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1">
            More Options <span className="ml-1">▼</span>
          </Button>
          <Button variant="outline" className="gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="outline" className="gap-1" onClick={handleSaveAndClose}>
            <Save className="h-4 w-4" />
            Save & Close
          </Button>
          <Button className="bg-[#4954e6] hover:bg-[#3a43c9]">Set Live</Button>
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            <Input
              value={journeyName}
              onChange={(e) => {
                setJourneyName(e.target.value)
                if (journey) {
                  const updatedJourney = { ...journey, name: e.target.value }
                  sessionStorage.setItem(params.id, JSON.stringify(updatedJourney))
                }
              }}
              className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 font-bold text-xl"
            />
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <JourneyCanvas nodes={journey.nodes} onNodesChange={handleNodesChange} />
      </div>
    </div>
  )
}
