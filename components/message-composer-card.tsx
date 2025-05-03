"use client"

import { useState } from "react"
import { Sparkles, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface MessageComposerCardProps {
  initialTitle?: string
  initialSubtitle?: string
  initialBody?: string
  onSave?: (data: { title: string; subtitle: string; body: string }) => void
}

export function MessageComposerCard({
  initialTitle = "",
  initialSubtitle = "",
  initialBody = "",
  onSave,
}: MessageComposerCardProps) {
  const [title, setTitle] = useState(initialTitle)
  const [subtitle, setSubtitle] = useState(initialSubtitle)
  const [body, setBody] = useState(initialBody)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">2. Message</h2>

      <div className="border rounded-lg p-6 space-y-6">
        {/* Smart Assist Banner - Now inside the card */}
        <div className="bg-indigo-50 rounded-lg p-4 flex justify-between items-center">
          <span className="text-indigo-700 font-medium">Use Smart Assist to create or refine your content</span>
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-lg font-medium">
            Title
          </label>
          <div className="relative">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pr-10"
              placeholder="Enter title"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Subtitle Input */}
        <div className="space-y-2">
          <label htmlFor="subtitle" className="block text-lg font-medium">
            Subtitle
          </label>
          <div className="relative">
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="pr-10"
              placeholder="Enter subtitle"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-lg font-medium">
            Message<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Textarea
              id="message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[120px] resize-none pr-10"
              placeholder="Enter message"
            />
            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-4">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
