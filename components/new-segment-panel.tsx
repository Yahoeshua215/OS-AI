"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit3, Sparkles, Target } from "lucide-react"
import { AISegmentPanel } from "@/components/ai-segment-panel"
import { SegmentBuilder } from "@/components/segment-builder"
import type { SegmentFilter } from "@/types/segment-types"

interface NewSegmentPanelProps {
  open: boolean
  onClose: () => void
}

export function NewSegmentPanel({ open, onClose }: NewSegmentPanelProps) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [manualBuilderOpen, setManualBuilderOpen] = useState(false)
  const [goalBuilderOpen, setGoalBuilderOpen] = useState(false)

  const [selectedGoalFilters, setSelectedGoalFilters] = useState<SegmentFilter[]>([])
  const [selectedGoalName, setSelectedGoalName] = useState<string>("")
  const [customGoalName, setCustomGoalName] = useState<string>("")
  const [customGoalDescription, setCustomGoalDescription] = useState<string>("")

  const handleManualSelect = () => {
    setManualBuilderOpen(true)
  }

  const handleAISelect = () => {
    setAiPanelOpen(true)
  }

  const handleGoalSelect = () => {
    setGoalBuilderOpen(true)
  }

  const handleCreateSegment = (name: string, filters: SegmentFilter[]) => {
    console.log("Creating segment:", name, filters)

    // In a real implementation, this would save the segment to the database
    // For now, we'll simulate a successful save

    // Close the panel
    onClose()

    // Redirect to the segments page after a short delay
    setTimeout(() => {
      window.location.href = "/segments"
    }, 500)
  }

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="bg-black/20 absolute inset-0" onClick={onClose}></div>

        <div className="relative w-full max-w-3xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Create New Segment</h2>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Choose how to create your segment</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {/* Build Manually Card */}
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Edit3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Build Manually</h4>
                  <p className="text-gray-500 mb-4 text-xs">
                    Create a segment by selecting specific user properties, behaviors, and conditions.
                  </p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 mt-2" onClick={handleManualSelect}>
                    Select
                  </Button>
                </div>

                {/* Start from a Goal Card */}
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-green-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Start from a Goal</h4>
                  <p className="text-gray-500 mb-4 text-xs">
                    Define a goal or choose from existing ones to create a targeted segment.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700 mt-2" onClick={handleGoalSelect}>
                    Select
                  </Button>
                </div>

                {/* Describe it Card (formerly Describe your audience) */}
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-pink-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-pink-600" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Describe it</h4>
                  <p className="text-gray-500 mb-4 text-xs">
                    Describe your target audience in plain language and let AI build the segment for you.
                  </p>
                  <Button className="bg-pink-600 hover:bg-pink-700 mt-2" onClick={handleAISelect}>
                    Select
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Segments with the highest engagement</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Active Users",
                    description: "Users who have been active in the last 7 days",
                  },
                  {
                    title: "Lapsed Users",
                    description: "Users who haven't been active in the last 30 days",
                  },
                  {
                    title: "High-Value Customers",
                    description: "Users who have spent more than $100 in the last 90 days",
                  },
                ].map((template, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={handleManualSelect}
                  >
                    <h4 className="font-medium">{template.title}</h4>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>Need help? Check our </span>
                <a href="#" className="text-indigo-600 hover:underline">
                  segment documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Segment Panel */}
      <AISegmentPanel
        open={aiPanelOpen}
        onClose={() => {
          setAiPanelOpen(false)
          onClose()
        }}
        onCreateSegment={handleCreateSegment}
        title="Create Segment with AI"
      />

      {/* Manual Segment Builder Panel */}
      {manualBuilderOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="bg-black/20 absolute inset-0"
            onClick={() => {
              setManualBuilderOpen(false)
              onClose()
            }}
          ></div>

          <div className="relative w-full max-w-5xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Segment Builder</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setManualBuilderOpen(false)
                  onClose()
                }}
              >
                Cancel
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <SegmentBuilder
                initialFilters={selectedGoalFilters}
                initialName={selectedGoalName}
                onSave={handleCreateSegment}
                onClose={() => {
                  setManualBuilderOpen(false)
                  onClose()
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Goal-based Segment Builder Panel */}
      {goalBuilderOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="bg-black/20 absolute inset-0"
            onClick={() => {
              setGoalBuilderOpen(false)
              onClose()
            }}
          ></div>

          <div className="relative w-full max-w-5xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Goal-based Segment Builder</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setGoalBuilderOpen(false)
                  onClose()
                }}
              >
                Cancel
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Choose a goal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Increase Engagement",
                      description: "Target users who are likely to engage more with your content",
                      filters: [
                        {
                          id: `last-session-${Date.now()}`,
                          type: "Last Session",
                          operator: "is less than",
                          value: "7",
                          unit: "days ago",
                        },
                        {
                          id: `session-count-${Date.now()}`,
                          type: "Session Count",
                          operator: "is greater than",
                          value: "3",
                        },
                      ],
                    },
                    {
                      title: "Boost Conversions",
                      description: "Reach users who are most likely to convert or make a purchase",
                      filters: [
                        {
                          id: `custom-event-${Date.now()}`,
                          type: "Custom Event",
                          eventName: "add_to_cart",
                          operator: "has occurred",
                          count: "at least",
                          value: "1",
                          timeframe: "within",
                          timeValue: "30",
                          timeUnit: "days",
                        },
                      ],
                    },
                    {
                      title: "Reduce Churn",
                      description: "Target at-risk users who might stop using your app",
                      filters: [
                        {
                          id: `last-session-${Date.now()}`,
                          type: "Last Session",
                          operator: "is greater than",
                          value: "14",
                          unit: "days ago",
                        },
                        {
                          id: `session-count-${Date.now()}`,
                          type: "Session Count",
                          operator: "is greater than",
                          value: "5",
                        },
                      ],
                    },
                    {
                      title: "Re-engage Dormant Users",
                      description: "Bring back users who haven't been active recently",
                      filters: [
                        {
                          id: `last-session-${Date.now()}`,
                          type: "Last Session",
                          operator: "is greater than",
                          value: "30",
                          unit: "days ago",
                        },
                        {
                          id: `session-count-${Date.now()}`,
                          type: "Session Count",
                          operator: "is greater than",
                          value: "2",
                        },
                      ],
                    },
                  ].map((goal, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        console.log(`Selected goal: ${goal.title}`)
                        // Open the segment builder with pre-populated filters based on the goal
                        setGoalBuilderOpen(false)
                        setManualBuilderOpen(true)
                        // Pass the goal's filters to the segment builder
                        setSelectedGoalFilters(goal.filters)
                        setSelectedGoalName(`${goal.title} Segment`)
                      }}
                    >
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-gray-500">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Define a custom goal</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        placeholder="e.g., Increase Premium Subscriptions"
                        value={customGoalName}
                        onChange={(e) => setCustomGoalName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Goal Description</label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        placeholder="Describe what you want to achieve with this segment"
                        value={customGoalDescription}
                        onChange={(e) => setCustomGoalDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          console.log("Creating custom goal segment")
                          // Open the segment builder with pre-populated filters for custom goal
                          setGoalBuilderOpen(false)
                          setManualBuilderOpen(true)
                          // Create default filters for custom goal
                          const customFilters = [
                            {
                              id: `custom-event-${Date.now()}`,
                              type: "Custom Event",
                              eventName: "app_open",
                              operator: "has occurred",
                              count: "at least",
                              value: "1",
                              timeframe: "within",
                              timeValue: "30",
                              timeUnit: "days",
                            },
                          ]
                          setSelectedGoalFilters(customFilters)
                          setSelectedGoalName(customGoalName || "Custom Goal Segment")
                        }}
                        disabled={!customGoalName.trim()}
                      >
                        Create Segment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
