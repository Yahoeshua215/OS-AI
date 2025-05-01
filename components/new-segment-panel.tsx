"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit3, Sparkles } from "lucide-react"
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

  const handleManualSelect = () => {
    setManualBuilderOpen(true)
  }

  const handleAISelect = () => {
    setAiPanelOpen(true)
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

              <div className="grid grid-cols-2 gap-6">
                {/* Build Manually Card */}
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Edit3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Build Manually</h4>
                  <p className="text-gray-500 mb-4">
                    Create a segment by selecting specific user properties, behaviors, and conditions.
                  </p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 mt-2" onClick={handleManualSelect}>
                    Select
                  </Button>
                </div>

                {/* Create with AI Card */}
                <div className="border-2 border-pink-400 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-pink-600" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Create with AI</h4>
                  <p className="text-gray-500 mb-4">
                    Describe your target audience in plain language and let AI build the segment for you.
                  </p>
                  <Button className="bg-pink-600 hover:bg-pink-700 mt-2" onClick={handleAISelect}>
                    Select
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Popular segment templates</h3>
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
                initialFilters={[]}
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
    </>
  )
}
