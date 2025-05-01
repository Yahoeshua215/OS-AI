"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Calendar, Clock, ThumbsUp, ThumbsDown } from "lucide-react"

interface MessageComposerProps {
  initialTitle?: string
  initialBody?: string
  onClose: () => void
}

export function MessageComposer({ initialTitle = "", initialBody = "", onClose }: MessageComposerProps) {
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)
  const [activeTab, setActiveTab] = useState("compose")

  // Update state when props change
  useEffect(() => {
    setTitle(initialTitle)
    setBody(initialBody)
  }, [initialTitle, initialBody])

  const handleSend = () => {
    // In a real implementation, this would send the notification
    alert(`Notification sent!\nTitle: ${title}\nBody: ${body}`)
    onClose()
  }

  const handleSchedule = () => {
    // In a real implementation, this would schedule the notification
    alert(`Notification scheduled!\nTitle: ${title}\nBody: ${body}`)
    onClose()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compose Push Notification</CardTitle>
      </CardHeader>

      <Tabs defaultValue="compose" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter notification message"
              className="min-h-[120px]"
            />
          </div>
          {initialTitle && initialBody && (
            <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-pink-600 font-medium">AI-generated content</span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Rate this content:</span>
                  <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                    <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                  </button>
                  <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                    <ThumbsDown className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-date">Date</Label>
            <div className="relative">
              <Input id="schedule-date" type="date" className="pl-10" />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-time">Time</Label>
            <div className="relative">
              <Input id="schedule-time" type="time" className="pl-10" />
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-title">Title</Label>
            <Input
              id="schedule-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-body">Message</Label>
            <Textarea
              id="schedule-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter notification message"
              className="min-h-[120px]"
            />
          </div>
        </TabsContent>
      </Tabs>

      <CardFooter className="flex justify-end space-x-2 border-t p-4">
        {activeTab === "compose" ? (
          <Button onClick={handleSend} className="bg-indigo-600 hover:bg-indigo-700">
            <Send className="mr-2 h-4 w-4" />
            Send Now
          </Button>
        ) : (
          <Button onClick={handleSchedule} className="bg-indigo-600 hover:bg-indigo-700">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
