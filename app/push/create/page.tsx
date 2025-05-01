"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload, Wand2, Sparkles } from "lucide-react"
import Link from "next/link"
import { AINotificationPanel } from "@/components/ai-notification-panel"
import { InputEnhancementDropdown } from "@/components/input-enhancement-dropdown"
import { RefreshVariationsButton, type RefreshVariationsButtonRef } from "@/components/refresh-variations-button"

export default function CreatePushPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialized = useRef(false)

  // State for form data
  const [activeVariant, setActiveVariant] = useState("variant-a")
  const [messageName, setMessageName] = useState("")
  const [audienceType, setAudienceType] = useState("new-users")
  const [variants, setVariants] = useState<
    Array<{
      id: string
      title: string
      subtitle: string
      message: string
      image: string
      url: string
    }>
  >([])

  // Add state for the AI panel
  const [aiPanelOpen, setAiPanelOpen] = useState(false)

  // Refs for the hidden message assist triggers
  const titleAssistRef = useRef<RefreshVariationsButtonRef>(null)
  const subtitleAssistRef = useRef<RefreshVariationsButtonRef>(null)
  const messageAssistRef = useRef<RefreshVariationsButtonRef>(null)

  // Refs for the input elements
  const titleInputRef = useRef<HTMLInputElement>(null)
  const subtitleInputRef = useRef<HTMLInputElement>(null)
  const messageInputRef = useRef<HTMLTextAreaElement>(null)

  // Initialize variants based on URL params
  useEffect(() => {
    if (initialized.current) return

    console.log("Initializing variants from URL params")

    // Get the base notification data
    const title = searchParams.get("title") || ""
    const subtitle = searchParams.get("subtitle") || ""
    const body = searchParams.get("body") || ""

    // Get the number of variants
    const variantCountParam = searchParams.get("variants")
    const variantCount = variantCountParam ? Number.parseInt(variantCountParam, 10) : 1

    console.log(`Creating ${variantCount} variants`)

    // Create an array to hold all variants
    const newVariants = []

    // Add the first variant (Variant A)
    newVariants.push({
      id: "variant-a",
      title: title,
      subtitle: subtitle,
      message: body,
      image: "",
      url: "",
    })

    // Add additional variants if specified
    for (let i = 1; i < variantCount; i++) {
      const variantId = `variant-${String.fromCharCode(97 + i)}` // a, b, c, ...
      const variantTitle = searchParams.get(`title${i}`) || ""
      const variantSubtitle = searchParams.get(`subtitle${i}`) || ""
      const variantBody = searchParams.get(`body${i}`) || ""

      newVariants.push({
        id: variantId,
        title: variantTitle || title,
        subtitle: variantSubtitle || subtitle,
        message: variantBody || body,
        image: "",
        url: "",
      })
    }

    console.log("Setting variants:", newVariants)
    setVariants(newVariants)
    initialized.current = true
  }, [searchParams])

  // Add these functions after the existing state declarations
  const handleOpenAIPanel = () => {
    setAiPanelOpen(true)
  }

  const handleCloseAIPanel = () => {
    setAiPanelOpen(false)
  }

  const handleSelectNotification = (
    aiNotification: { title: string; subtitle: string; body: string },
    variantId?: string,
  ) => {
    if (variantId) {
      // Update a specific variant
      updateVariant(variantId, "title", aiNotification.title)
      updateVariant(variantId, "subtitle", aiNotification.subtitle || "")
      updateVariant(variantId, "message", aiNotification.body)
    } else {
      // Update the currently active variant
      updateVariant(activeVariant, "title", aiNotification.title)
      updateVariant(activeVariant, "subtitle", aiNotification.subtitle || "")
      updateVariant(activeVariant, "message", aiNotification.body)
    }
    setAiPanelOpen(false)
  }

  // Update a specific variant's data
  const updateVariant = (id: string, field: string, value: string) => {
    setVariants((prev) => prev.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant)))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the data to an API
    alert("Push notification created!")
    router.push("/push")
  }

  // Add a new variant
  const addVariant = () => {
    if (variants.length >= 12) return

    const newId = `variant-${String.fromCharCode(97 + variants.length)}`
    const baseVariant = variants[0] || { title: "", subtitle: "", message: "" }

    setVariants((prev) => [
      ...prev,
      {
        id: newId,
        title: `${baseVariant.title} (Variant ${String.fromCharCode(65 + variants.length)})`,
        subtitle: baseVariant.subtitle || "",
        message: `${baseVariant.message} (Variant ${String.fromCharCode(65 + variants.length)})`,
        image: "",
        url: "",
      },
    ])
  }

  // Delete a variant
  const deleteVariant = (id: string) => {
    // Don't allow deleting if there's only one variant
    if (variants.length <= 1) return

    // Remove the variant
    setVariants((prev) => prev.filter((variant) => variant.id !== id))

    // If the active variant is being deleted, switch to the first variant
    if (activeVariant === id) {
      setActiveVariant(variants[0].id === id ? variants[1].id : variants[0].id)
    }
  }

  // Get the current active variant data
  const currentVariant = variants.find((v) => v.id === activeVariant) || {
    id: "variant-a",
    title: "",
    subtitle: "",
    message: "",
    image: "",
    url: "",
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Org Name</span>
            <span className="mx-2">›</span>
            <span>App Name</span>
            <span className="mx-2">›</span>
            <Link href="/messages" className="hover:text-gray-700">
              Messages
            </Link>
            <span className="mx-2">›</span>
            <Link href="/push" className="hover:text-gray-700">
              Push
            </Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">New Push Notification</span>
          </div>

          <h1 className="text-2xl font-bold mb-6">New Push Notification</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <Label htmlFor="message-name" className="text-base font-medium">
                Message Name
              </Label>
              <Input
                id="message-name"
                placeholder="Campaign Name or Internal Name"
                className="mt-1 max-w-xl"
                value={messageName}
                onChange={(e) => setMessageName(e.target.value)}
                required
              />
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-lg font-medium mb-4">1. Audience</h2>

              <RadioGroup value={audienceType} onValueChange={setAudienceType} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new-users" id="new-users" />
                  <Label htmlFor="new-users">Send to new users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="segments" id="segments" />
                  <Label htmlFor="segments">Send to particular segment(s)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">2. Message</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" type="button" className="flex items-center">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Dynamic Content
                  </Button>
                  <Button variant="outline" type="button" className="flex items-center">
                    Test & Preview
                  </Button>
                </div>
              </div>

              {variants.length > 0 && (
                <Tabs value={activeVariant} onValueChange={setActiveVariant} className="mb-6">
                  <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
                    {variants.map((variant) => (
                      <div key={variant.id} className="group relative">
                        <TabsTrigger
                          value={variant.id}
                          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                        >
                          {variant.id === "variant-a"
                            ? "Variant A"
                            : variant.id === "variant-b"
                              ? "Variant B"
                              : `Variant ${variant.id.split("-")[1].toUpperCase()}`}
                        </TabsTrigger>
                        {variants.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              deleteVariant(variant.id)
                            }}
                            className="absolute -right-1 -top-1 size-5 rounded-full bg-gray-200 text-gray-500 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100 flex items-center justify-center"
                            aria-label={`Delete ${variant.id === "variant-a" ? "Variant A" : variant.id === "variant-b" ? "Variant B" : `Variant ${variant.id.split("-")[1].toUpperCase()}`}`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6 6 18"></path>
                              <path d="m6 6 12 12"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {variants.length < 12 && (
                      <Button
                        variant="ghost"
                        className="rounded-none px-4 py-2 text-indigo-600"
                        onClick={addVariant}
                        type="button"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Variant
                      </Button>
                    )}
                  </TabsList>
                </Tabs>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div
                    className="bg-[#f3f0f4] bg-opacity-50 rounded-md p-2 flex items-center justify-between cursor-pointer hover:bg-opacity-70 transition-colors"
                    onClick={handleOpenAIPanel}
                  >
                    <span className="text-sm text-[#303293]">Use Smart Assist to create or refine your content</span>
                    <Sparkles className="h-4 w-4 text-[#303293]" />
                  </div>
                  <div>
                    <Label htmlFor={`title-${activeVariant}`} className="font-medium">
                      Title
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id={`title-${activeVariant}`}
                        placeholder="Title (Any/English)"
                        className="mt-1 pr-10"
                        value={currentVariant?.title || ""}
                        onChange={(e) => updateVariant(activeVariant, "title", e.target.value)}
                        required
                        ref={titleInputRef}
                      />
                      <InputEnhancementDropdown
                        content={currentVariant.title}
                        fieldType="title"
                        onSelectMessageAssist={handleTitleMessageAssist}
                        onInsertPersonalization={() => {
                          // Placeholder for personalization tag insertion
                          alert(`Insert personalization tag for title`)
                        }}
                        onInsertEmoji={() => {
                          // Placeholder for emoji insertion
                          alert(`Insert emoji for title`)
                        }}
                      />
                      {/* RefreshVariationsButton for title */}
                      <RefreshVariationsButton
                        content={currentVariant.title}
                        fieldType="title"
                        onSelectVariation={(variation) => updateVariant(activeVariant, "title", variation)}
                        onAdvancedOptions={handleOpenAIPanel}
                        ref={titleAssistRef}
                        inputRef={titleInputRef}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`subtitle-${activeVariant}`} className="font-medium">
                      Subtitle
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id={`subtitle-${activeVariant}`}
                        placeholder="Subtitle (Any/English)"
                        className="mt-1 pr-10"
                        value={currentVariant?.subtitle || ""}
                        onChange={(e) => updateVariant(activeVariant, "subtitle", e.target.value)}
                        ref={subtitleInputRef}
                      />
                      <InputEnhancementDropdown
                        content={currentVariant.subtitle}
                        fieldType="subtitle"
                        onSelectMessageAssist={handleSubtitleMessageAssist}
                        onInsertPersonalization={() => {
                          // Placeholder for personalization tag insertion
                          alert(`Insert personalization tag for subtitle`)
                        }}
                        onInsertEmoji={() => {
                          // Placeholder for emoji insertion
                          alert(`Insert emoji for subtitle`)
                        }}
                      />
                      {/* RefreshVariationsButton for subtitle */}
                      <RefreshVariationsButton
                        content={currentVariant.subtitle}
                        fieldType="subtitle"
                        onSelectVariation={(variation) => updateVariant(activeVariant, "subtitle", variation)}
                        onAdvancedOptions={handleOpenAIPanel}
                        ref={subtitleAssistRef}
                        inputRef={subtitleInputRef}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`message-${activeVariant}`} className="font-medium">
                      Message<span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1">
                      <Textarea
                        id={`message-${activeVariant}`}
                        placeholder="Message (Any/English)"
                        className="mt-1 pr-10"
                        value={currentVariant?.message || ""}
                        onChange={(e) => updateVariant(activeVariant, "message", e.target.value)}
                        required
                        ref={messageInputRef}
                      />
                      <InputEnhancementDropdown
                        content={currentVariant.message}
                        fieldType="message"
                        onSelectMessageAssist={handleMessageMessageAssist}
                        onInsertPersonalization={() => {
                          // Placeholder for personalization tag insertion
                          alert(`Insert personalization tag for message`)
                        }}
                        onInsertEmoji={() => {
                          // Placeholder for emoji insertion
                          alert(`Insert emoji for message`)
                        }}
                        className="top-4"
                      />
                      {/* RefreshVariationsButton for message */}
                      <RefreshVariationsButton
                        content={currentVariant.message}
                        fieldType="message"
                        onSelectVariation={(variation) => updateVariant(activeVariant, "message", variation)}
                        onAdvancedOptions={handleOpenAIPanel}
                        ref={messageAssistRef}
                        inputRef={messageInputRef}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`image-${activeVariant}`} className="font-medium">
                      Image
                    </Label>
                    <div className="flex mt-1">
                      <Input
                        id={`image-${activeVariant}`}
                        placeholder="Upload or input url"
                        className="rounded-r-none"
                        value={currentVariant?.image || ""}
                        onChange={(e) => updateVariant(activeVariant, "image", e.target.value)}
                      />
                      <Button variant="outline" type="button" className="rounded-l-none border-l-0">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`url-${activeVariant}`} className="font-medium">
                      Launch URL
                    </Label>
                    <Input
                      id={`url-${activeVariant}`}
                      placeholder="http://bit.ly/abc"
                      className="mt-1"
                      value={currentVariant?.url || ""}
                      onChange={(e) => updateVariant(activeVariant, "url", e.target.value)}
                    />
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      type="button"
                      className="mt-4 flex items-center text-indigo-600 hover:bg-[#ececfc] hover:text-indigo-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Languages
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-[300px] h-[600px] bg-gray-200 rounded-[40px] p-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-6 bg-gray-300 rounded-t-[40px] flex justify-center items-center">
                      <div className="w-20 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="mt-8 text-center text-8xl text-white font-light">11:17</div>

                    <div className="absolute bottom-32 left-4 right-4">
                      <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-start">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <p className="font-medium text-sm">{currentVariant?.title || "Title..."}</p>
                                <p className="text-xs text-gray-500">App Name • now</p>
                              </div>
                              <div className="text-xs">▼</div>
                            </div>
                            <p className="text-sm mt-1">{currentVariant?.message || "Message..."}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" type="button" onClick={() => router.push("/push")}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
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
        variants={variants}
        activeVariant={activeVariant}
        onDeleteVariant={deleteVariant}
      />
    </div>
  )
}
