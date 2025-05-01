"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AISegmentGenerator } from "@/components/ai-segment-generator"
import { SegmentBuilder } from "@/components/segment-builder"
import type { SegmentFilter } from "@/types/segment-types"

interface AISegmentPanelProps {
  open: boolean
  onClose: () => void
  onCreateSegment: (name: string, filters: SegmentFilter[]) => void
  title?: string
}

export function AISegmentPanel({
  open,
  onClose,
  onCreateSegment,
  title = "Create Segment with AI",
}: AISegmentPanelProps) {
  const [generatedFilters, setGeneratedFilters] = useState<SegmentFilter[]>([])
  const [showBuilder, setShowBuilder] = useState(false)

  const handleGenerateFilters = (filters: SegmentFilter[]) => {
    setGeneratedFilters(filters)
    setShowBuilder(true)
  }

  const handleCreateSegment = (name: string, filters: SegmentFilter[]) => {
    // Call the onCreateSegment prop to save the segment
    onCreateSegment(name, filters)

    // Close the panel
    onClose()

    // Redirect to the segments page after a short delay
    setTimeout(() => {
      window.location.href = "/segments"
    }, 500)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="bg-black/20 absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-5xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{showBuilder ? "Segment Builder" : title}</h2>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!showBuilder ? (
            <AISegmentGenerator onGenerateFilters={handleGenerateFilters} onClose={onClose} />
          ) : (
            <SegmentBuilder initialFilters={generatedFilters} onSave={handleCreateSegment} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}
