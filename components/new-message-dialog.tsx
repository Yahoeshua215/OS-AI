"use client"

import { useState } from "react"
import { Search, Edit3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AINotificationPanel } from "@/components/ai-notification-panel"
import { MessageComposer } from "@/components/message-composer"
import { useSupabase } from "@/lib/use-supabase"
import { useRouter } from "next/navigation"

interface NewMessageSidePanelProps {
  open: boolean
  onClose: () => void
}

export function NewMessageSidePanel({ open, onClose }: NewMessageSidePanelProps) {
  const [activeTab, setActiveTab] = useState("templates")
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [composerOpen, setComposerOpen] = useState(false)
  const [notificationData, setNotificationData] = useState<{ title: string; body: string } | null>(null)
  const router = useRouter()

  // Force Supabase to be considered as configured
  useSupabase(true)

  // Sample template data
  const templates = [
    "Uh-oh, your prescription is expiring",
    "You're missing out on points",
    "[URGENT] You've got ONE DAY to watch this...",
    "Your 7-figure plan goes bye-bye at midnight...",
    "[WEEKEND ONLY] Get this NOW before it's gone...",
    "Mary, Earn double points today only",
    "9 Disgusting Facts about Thanksgiving",
    "Tonight only: A denim lover's dream",
    "Pairs nicely with spreadsheets",
    "Try To Avoid These 27 People On New Year's Eve",
    "Complimentary gift wrap on all purchases",
  ]

  const handleAISelect = () => {
    setAiPanelOpen(true)
  }

  const handleBlankSelect = () => {
    router.push("/push/new")
  }

  const handleSelectNotification = (notification: { title: string; body: string }) => {
    setNotificationData(notification)
    setAiPanelOpen(false)
    setComposerOpen(true)
  }

  // Close all panels and reset state
  const handleClose = () => {
    setAiPanelOpen(false)
    setComposerOpen(false)
    setNotificationData(null)
    onClose()
  }

  if (!open) return null

  if (composerOpen && notificationData) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="bg-black/20 absolute inset-0" onClick={handleClose}></div>

        <div className="relative w-full max-w-3xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <MessageComposer
              initialTitle={notificationData.title}
              initialBody={notificationData.body}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="bg-black/20 absolute inset-0" onClick={handleClose}></div>

        <div className="relative w-full max-w-3xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">New Push</h2>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Start from scratch</h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Blank Push Card */}
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Edit3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Blank Push</h4>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 mt-2" onClick={handleBlankSelect}>
                    Select
                  </Button>
                </div>

                {/* Generate from AI Card - Updated to "Describe your push content" */}
                <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">Describe your push content</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Let AI help you craft the perfect message based on your description
                  </p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 mt-2" onClick={handleAISelect}>
                    Select
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 mb-6 bg-transparent p-0 border-b gap-2">
                <TabsTrigger
                  value="templates"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center justify-center"
                >
                  <span>Your templates</span>
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full min-w-[32px] text-center">
                    232
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="previous"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center justify-center"
                >
                  <span>Your previous messages</span>
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full min-w-[32px] text-center">
                    50
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="quickstart"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center justify-center"
                >
                  <span>OneSignal quickstart designs</span>
                  <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full min-w-[32px] text-center">
                    15
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name" className="pl-10 h-10 border-gray-300" />
              </div>

              <TabsContent value="templates" className="mt-0">
                <div className="space-y-0">
                  <div className="py-3 border-b">
                    <h4 className="font-medium">Name</h4>
                  </div>

                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="py-3 border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setNotificationData({
                          title: template,
                          body: "This is a sample notification body for " + template.toLowerCase(),
                        })
                        setComposerOpen(true)
                      }}
                    >
                      {template}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="previous" className="mt-0">
                <div className="text-center py-8 text-gray-500">Your previous messages will appear here</div>
              </TabsContent>

              <TabsContent value="quickstart" className="mt-0">
                <div className="text-center py-8 text-gray-500">OneSignal quickstart designs will appear here</div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="mr-4">Drag & drop editor</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AINotificationPanel open={aiPanelOpen} onClose={handleClose} onSelectNotification={handleSelectNotification} />
    </>
  )
}
