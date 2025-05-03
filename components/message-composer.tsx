"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageComposerCard } from "./message-composer-card"

interface MessageComposerProps {
  initialTitle?: string
  initialBody?: string
  onClose?: () => void
}

export function MessageComposer({ initialTitle = "", initialBody = "", onClose }: MessageComposerProps) {
  const [title, setTitle] = useState(initialTitle)
  const [subtitle, setSubtitle] = useState("")
  const [body, setBody] = useState(initialBody)

  const handleSave = (data: { title: string; subtitle: string; body: string }) => {
    setTitle(data.title)
    setSubtitle(data.subtitle)
    setBody(data.body)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Push</h1>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Step 1 content would go here */}

        {/* Step 2: Message */}
        <MessageComposerCard initialTitle={title} initialSubtitle={subtitle} initialBody={body} onSave={handleSave} />

        {/* Additional steps would go here */}
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button variant="outline">Save as Draft</Button>
        <Button>Continue</Button>
      </div>
    </div>
  )
}
