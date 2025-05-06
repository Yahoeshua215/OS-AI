"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, Upload, Wand2, Sparkles, LayoutPanelLeft, Eye } from "lucide-react"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { AINotificationPanel } from "@/components/ai-notification-panel"
import { InputEnhancementDropdown } from "@/components/input-enhancement-dropdown"
import { RefreshVariationsButton, type RefreshVariationsButtonRef } from "@/components/refresh-variations-button"

export default function NewPushPage() {
  const router = useRouter()
  const [messageName, setMessageName] = useState("")
  const [audienceType, setAudienceType] = useState("new-users")
  const [platformSettingsOpen, setPlatformSettingsOpen] = useState(false)
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [notification, setNotification] = useState({
    title: "",
    subtitle: "",
    message: "",
    image: "",
    url: "",
  })

  // Refs for the message assist triggers
  const titleAssistRef = useRef<RefreshVariationsButtonRef>(null)
  const subtitleAssistRef = useRef<RefreshVariationsButtonRef>(null)
  const messageAssistRef = useRef<RefreshVariationsButtonRef>(null)

  // Refs for the input elements
  const titleInputRef = useRef<HTMLInputElement>(null)
  const subtitleInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  const updateNotification = (field: string, value: string) => {
    setNotification((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the data to an API
    alert("Push notification created!")
    router.push("/push")
  }

  const handleABTest = () => {
    // Navigate to the A/B test page with the current notification data
    const params = new URLSearchParams({
      title: notification.title,
      subtitle: notification.subtitle,
      body: notification.message,
      variants: "2", // Default to 2 variants
    })
    router.push(`/push/create?${params.toString()}`)
  }

  const handleOpenAIPanel = () => {
    setAiPanelOpen(true)
  }

  const handleCloseAIPanel = () => {
    setAiPanelOpen(false)
  }

  const handleSelectNotification = (aiNotification: { title: string; subtitle: string; body: string }) => {
    setNotification((prev) => ({
      ...prev,
      title: aiNotification.title,
      subtitle: aiNotification.subtitle || "",
      message: aiNotification.body,
    }))
    setAiPanelOpen(false)
  }

  // Handlers for the message assist triggers
  const handleTitleMessageAssist = () => {
    if (titleAssistRef.current) {
      titleAssistRef.current.openPopover()
    }
  }

  const handleSubtitleMessageAssist = () => {
    if (subtitleAssistRef.current) {
      subtitleAssistRef.current.openPopover()
    }
  }

  const handleMessageMessageAssist = () => {
    if (messageAssistRef.current) {
      messageAssistRef.current.openPopover()
    }
  }

  return (
    <div className="flex h-screen bg-[#f6f7f8]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-sm text-[#5d6974] mb-2">
            <span>Org Name</span>
            <span className="mx-2">›</span>
            <span>App Name</span>
            <span className="mx-2">›</span>
            <Link href="/messages" className="hover:text-[#303293]">
              Messages
            </Link>
            <span className="mx-2">›</span>
            <span className="text-[#303293]">New Push Notification</span>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-[#212121]">New Push Notification</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Label htmlFor="message-name" className="text-base font-medium text-[#212121]">
                Message Name
              </Label>
              <Input
                id="message-name"
                placeholder="Campaign Name or Internal Name"
                className="mt-1 max-w-xl border-[#cbd1d7] focus-visible:ring-[#303293]"
                value={messageName}
                onChange={(e) => setMessageName(e.target.value)}
                required
              />
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#e5e8eb]">
              <h2 className="text-lg font-medium mb-4 text-[#212121]">1. Audience</h2>

              <RadioGroup value={audienceType} onValueChange={setAudienceType} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new-users" id="new-users" className="border-[#303293] text-[#303293]" />
                  <Label htmlFor="new-users" className="text-[#212121]">
                    Send to new users
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="segments" id="segments" className="border-[#303293] text-[#303293]" />
                  <Label htmlFor="segments" className="text-[#212121]">
                    Send to particular segment(s)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-white p-6 rounded-lg border border-[#e5e8eb]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-[#212121]">2. Message</h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center border-[#cbd1d7] text-[#303293] hover:bg-[#ececfc] hover:text-[#303293] hover:border-[#303293]"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Dynamic Content
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center border-[#cbd1d7] text-[#303293] hover:bg-[#ececfc] hover:text-[#303293] hover:border-[#303293]"
                    onClick={handleABTest}
                  >
                    <LayoutPanelLeft className="mr-2 h-4 w-4" />
                    A/B Test
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="flex items-center border-[#cbd1d7] text-[#303293] hover:bg-[#ececfc] hover:text-[#303293] hover:border-[#303293]"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Test & Preview
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Message Content Card - START */}
                  <div className="border border-[#e5e8eb] rounded-lg p-5 space-y-5">
                    {/* Smart Assist Banner - Now inside the card */}
                    <div
                      className="bg-[#f3f0f4] bg-opacity-50 rounded-md p-2 flex items-center justify-between cursor-pointer hover:bg-opacity-70 transition-colors"
                      onClick={handleOpenAIPanel}
                    >
                      <span className="text-sm text-[#303293]">create / refine content</span>
                      <Sparkles className="h-4 w-4 text-[#303293]" />
                    </div>

                    {/* Title Input */}
                    <div>
                      <Label htmlFor="title" className="font-medium text-[#212121]">
                        Title
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="title"
                          placeholder="Title (Any/English)"
                          className="pr-10 border-[#cbd1d7] focus-visible:ring-[#303293]"
                          value={notification.title}
                          onChange={(e) => updateNotification("title", e.target.value)}
                          ref={titleInputRef}
                        />
                        <InputEnhancementDropdown
                          content={notification.title}
                          fieldType="title"
                          onSelectMessageAssist={handleTitleMessageAssist}
                          onInsertPersonalization={() => {
                            // Placeholder for personalization tag insertion
                            alert("Insert personalization tag for title")
                          }}
                          onInsertEmoji={() => {
                            // Placeholder for emoji insertion
                            alert("Insert emoji for title")
                          }}
                        />
                        {/* RefreshVariationsButton for title */}
                        <RefreshVariationsButton
                          content={notification.title}
                          fieldType="title"
                          onSelectVariation={(variation) => updateNotification("title", variation)}
                          onAdvancedOptions={handleOpenAIPanel}
                          ref={titleAssistRef}
                          inputRef={titleInputRef}
                        />
                      </div>
                    </div>

                    {/* Subtitle Input */}
                    <div>
                      <Label htmlFor="subtitle" className="font-medium text-[#212121]">
                        Subtitle
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="subtitle"
                          placeholder="Subtitle (Any/English)"
                          className="pr-10 border-[#cbd1d7] focus-visible:ring-[#303293]"
                          value={notification.subtitle}
                          onChange={(e) => updateNotification("subtitle", e.target.value)}
                          ref={subtitleInputRef}
                        />
                        <InputEnhancementDropdown
                          content={notification.subtitle}
                          fieldType="subtitle"
                          onSelectMessageAssist={handleSubtitleMessageAssist}
                          onInsertPersonalization={() => {
                            // Placeholder for personalization tag insertion
                            alert("Insert personalization tag for subtitle")
                          }}
                          onInsertEmoji={() => {
                            // Placeholder for emoji insertion
                            alert("Insert emoji for subtitle")
                          }}
                        />
                        {/* RefreshVariationsButton for subtitle */}
                        <RefreshVariationsButton
                          content={notification.subtitle}
                          fieldType="subtitle"
                          onSelectVariation={(variation) => updateNotification("subtitle", variation)}
                          onAdvancedOptions={handleOpenAIPanel}
                          ref={subtitleAssistRef}
                          inputRef={subtitleInputRef}
                        />
                      </div>
                    </div>

                    {/* Message Input */}
                    <div>
                      <Label htmlFor="message" className="font-medium text-[#212121]">
                        Message<span className="text-[#e54b4d]">*</span>
                      </Label>
                      <div className="relative mt-1">
                        <Textarea
                          id="message"
                          placeholder="Message (Any/English)"
                          className="pr-10 min-h-[120px] border-[#cbd1d7] focus-visible:ring-[#303293]"
                          value={notification.message}
                          onChange={(e) => updateNotification("message", e.target.value)}
                          required
                          ref={messageInputRef}
                        />
                        <InputEnhancementDropdown
                          content={notification.message}
                          fieldType="message"
                          onSelectMessageAssist={handleMessageMessageAssist}
                          onInsertPersonalization={() => {
                            // Placeholder for personalization tag insertion
                            alert("Insert personalization tag for message")
                          }}
                          onInsertEmoji={() => {
                            // Placeholder for emoji insertion
                            alert("Insert emoji for message")
                          }}
                          className="top-4"
                        />
                        {/* RefreshVariationsButton for message */}
                        <RefreshVariationsButton
                          content={notification.message}
                          fieldType="message"
                          onSelectVariation={(variation) => updateNotification("message", variation)}
                          onAdvancedOptions={handleOpenAIPanel}
                          ref={messageAssistRef}
                          inputRef={messageInputRef}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Message Content Card - END */}

                  <div>
                    <Label htmlFor="image" className="font-medium text-[#212121]">
                      Image
                    </Label>
                    <div className="flex mt-1">
                      <Input
                        id="image"
                        placeholder="Upload or input url"
                        className="rounded-r-none border-[#cbd1d7] focus-visible:ring-[#303293]"
                        value={notification.image}
                        onChange={(e) => updateNotification("image", e.target.value)}
                      />
                      <Button
                        variant="outline"
                        type="button"
                        className="rounded-l-none border-l-0 border-[#cbd1d7] text-[#303293] hover:bg-[#ececfc] hover:text-[#303293]"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="url" className="font-medium text-[#212121]">
                      Launch URL
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="url"
                        placeholder="http://bit.ly/abc"
                        className="pr-10 border-[#cbd1d7] focus-visible:ring-[#303293]"
                        value={notification.url}
                        onChange={(e) => updateNotification("url", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      type="button"
                      className="mt-4 mb-2 flex items-center text-[#303293] hover:bg-[#ececfc] hover:text-[#303293]"
                    >
                      <span className="text-[#303293] mr-2 text-lg">+</span>
                      Add Languages
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="different-url"
                      className="border-[#cbd1d7] text-[#303293] data-[state=checked]:bg-[#303293] data-[state=checked]:text-white"
                    />
                    <Label htmlFor="different-url" className="text-[#212121]">
                      Different URL for web/app
                    </Label>
                  </div>

                  <div>
                    <button
                      type="button"
                      className="flex items-center text-[#303293] font-medium"
                      onClick={() => setPlatformSettingsOpen(!platformSettingsOpen)}
                    >
                      <ChevronDown
                        className={`h-5 w-5 mr-1 transition-transform ${platformSettingsOpen ? "rotate-180" : ""}`}
                      />
                      Platform Settings
                    </button>

                    {platformSettingsOpen && (
                      <div className="mt-4 p-4 bg-[#f3f0f4] rounded-md">
                        <div className="flex items-center">
                          <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#303293] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                          </div>
                          <span className="ml-3 text-[#212121]">Send to Apple iOS</span>
                        </div>

                        <div className="mt-4">
                          <Label htmlFor="media" className="font-medium text-[#212121] flex items-center">
                            Media
                            <span className="ml-1 inline-flex items-center justify-center rounded-full bg-[#cbd1d7] text-white h-4 w-4 text-xs">
                              ?
                            </span>
                          </Label>
                          <div className="flex mt-1">
                            <Input
                              id="media"
                              placeholder="Upload or enter URL to image, sound, video"
                              className="rounded-r-none border-[#cbd1d7] focus-visible:ring-[#303293]"
                            />
                            <Button
                              variant="outline"
                              type="button"
                              className="rounded-l-none border-l-0 border-[#cbd1d7] text-[#303293] hover:bg-[#ececfc] hover:text-[#303293]"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-[300px] h-[600px] bg-[#f3f0f4] rounded-[40px] p-4 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-[#cbd1d7] rounded-t-[40px] flex justify-center items-center">
                      <div className="w-20 h-1 bg-[#74808b] rounded-full"></div>
                    </div>
                    <div className="mt-20 text-center text-[120px] text-white font-light">11:17</div>

                    <div className="absolute bottom-32 left-4 right-4">
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-[#cbd1d7] rounded-full flex-shrink-0"></div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-sm">{notification.title || "Title..."}</p>
                                <p className="text-xs text-[#5d6974]">App Name • now</p>
                              </div>
                              <div className="text-xs">▼</div>
                            </div>
                            <p className="text-sm mt-1">{notification.message || "Message..."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/push")}
                className="border-[#cbd1d7] text-[#212121] hover:bg-[#f3f0f4] hover:text-[#212121]"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#303293] hover:bg-[#212366] text-white">
                Create Push Notification
              </Button>
            </div>
          </form>
        </main>
      </div>

      <AINotificationPanel
        open={aiPanelOpen}
        onClose={handleCloseAIPanel}
        onSelectNotification={handleSelectNotification}
        existingNotification={notification}
      />
    </div>
  )
}
