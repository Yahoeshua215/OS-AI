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
import { Plus, Upload, Wand2, Sparkles, Calendar, Info, HelpCircle, Clock, TrendingUp, BarChart } from "lucide-react"
import Link from "next/link"
import { AINotificationPanel } from "@/components/ai-notification-panel"
import { InputEnhancementDropdown } from "@/components/input-enhancement-dropdown"
import { RefreshVariationsButton, type RefreshVariationsButtonRef } from "@/components/refresh-variations-button"
import { Checkbox } from "@/components/ui/checkbox"

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

  // Delivery schedule state
  const [deliveryType, setDeliveryType] = useState("immediately")
  const [scheduledDate, setScheduledDate] = useState("")
  const [optimizationType, setOptimizationType] = useState("same-time")
  const [overrideThrottling, setOverrideThrottling] = useState(false)
  const [intelligentDeliveryInfo, setIntelligentDeliveryInfo] = useState<string | null>(null)

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

  // Set current date/time as default for scheduled date
  useEffect(() => {
    const now = new Date()
    now.setHours(now.getHours() + 1)
    now.setMinutes(0)

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    setScheduledDate(`${year}-${month}-${day}T${hours}:${minutes}`)
  }, [])

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

  // Handle optimization type change
  const handleOptimizationTypeChange = (value: string) => {
    setOptimizationType(value)

    if (value === "intelligent-delivery") {
      // Generate intelligent delivery recommendation based on notification title
      const title = currentVariant?.title?.toLowerCase() || ""

      if (title.includes("sale") || title.includes("discount") || title.includes("offer") || title.includes("deal")) {
        setIntelligentDeliveryInfo(
          "Based on your past campaigns, promotional messages perform best when sent on Thursday between 11am-2pm local time. Your similar campaigns saw a 27% higher open rate during these times.",
        )
      } else if (title.includes("reminder") || title.includes("don't forget") || title.includes("limited time")) {
        setIntelligentDeliveryInfo(
          "Reminder notifications perform best when sent on weekdays between 9am-10am local time. Your past reminder campaigns saw 34% higher engagement during morning hours.",
        )
      } else if (title.includes("update") || title.includes("new") || title.includes("feature")) {
        setIntelligentDeliveryInfo(
          "Product update notifications perform best when sent on Tuesday or Wednesday between 2pm-5pm local time. Your users are 42% more likely to engage with product updates during these times.",
        )
      } else if (title.includes("welcome") || title.includes("thank you") || title.includes("thanks")) {
        setIntelligentDeliveryInfo(
          "Welcome and thank you messages perform best when sent immediately after the triggering action. For scheduled campaigns, early evening hours (6pm-8pm local time) show 31% higher engagement.",
        )
      } else if (title.includes("back") || title.includes("miss") || title.includes("return")) {
        setIntelligentDeliveryInfo(
          "Re-engagement messages perform best when sent on weekends or weekday evenings (after 6pm local time). Your past re-engagement campaigns saw 38% higher conversion rates during these periods.",
        )
      } else {
        setIntelligentDeliveryInfo(
          "Based on your audience behavior patterns, this type of message is likely to perform best when delivered between 11am-2pm on weekdays. We'll optimize delivery for each user's local time zone.",
        )
      }
    } else {
      setIntelligentDeliveryInfo(null)
    }
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

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    }

    return date.toLocaleDateString("en-US", options)
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
                  {/* Message Content Card - START */}
                  <div className="border border-gray-200 rounded-lg p-5 space-y-5">
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

                    {/* Subtitle Input */}
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

                    {/* Message Input */}
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
                  </div>
                  {/* Message Content Card - END */}

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

            {/* Delivery Schedule Card */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-medium mb-4">3. Delivery Schedule</h2>

                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="font-medium">When should this message start sending?</span>
                      <button type="button" className="ml-2 text-gray-500">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>

                    <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="immediately" id="immediately" />
                        <Label htmlFor="immediately">Immediately</Label>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="specific-time" id="specific-time" />
                          <Label htmlFor="specific-time">Specific Time</Label>
                        </div>
                        {deliveryType === "specific-time" && (
                          <div className="ml-6">
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                type="datetime-local"
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="font-medium">Per user optimization?</span>
                      <button type="button" className="ml-2 text-gray-500">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>

                    <RadioGroup
                      value={optimizationType}
                      onValueChange={handleOptimizationTypeChange}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="same-time" id="same-time" />
                        <Label htmlFor="same-time">Send to everyone at the same time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="intelligent-delivery"
                          id="intelligent-delivery"
                          disabled={!currentVariant?.title} // Disable if no title is provided
                        />
                        <div className="flex flex-col">
                          <Label
                            htmlFor="intelligent-delivery"
                            className={`flex items-center ${!currentVariant?.title ? "text-gray-400" : ""}`}
                          >
                            Intelligent Delivery (recommended)
                            <button type="button" className="ml-2 text-gray-500">
                              <HelpCircle className="h-4 w-4" />
                            </button>
                          </Label>
                          {!currentVariant?.title && (
                            <span className="text-xs text-red-500">
                              Please fill in the notification title to enable intelligent delivery
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom-timezone" id="custom-timezone" />
                        <div className="flex items-center">
                          <Label htmlFor="custom-timezone">Custom time per user timezone</Label>
                          <button type="button" className="ml-2 text-gray-500">
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="override-throttling"
                      checked={overrideThrottling}
                      onCheckedChange={(checked) => setOverrideThrottling(checked === true)}
                    />
                    <div className="flex items-center">
                      <Label htmlFor="override-throttling">Override throttling settings (1,000 per minute)</Label>
                      <button type="button" className="ml-2 text-gray-500">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  {intelligentDeliveryInfo ? (
                    <div className="bg-[#f3f0f4] p-4 rounded-lg border h-full">
                      <div className="flex items-start mb-4">
                        <Info className="h-5 w-5 text-[#303293] mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h3 className="font-medium mb-1">Intelligent Delivery Recommendation</h3>
                          <p className="text-sm text-gray-500">
                            {deliveryType === "specific-time" && scheduledDate ? (
                              <>
                                Message will start sending {formatDateForDisplay(scheduledDate)} with a limit of ~1,000
                                per minute.
                              </>
                            ) : (
                              <>Message will start sending immediately with a limit of ~1,000 per minute.</>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-md border mb-4">
                        <div className="flex items-start">
                          <TrendingUp className="h-4 w-4 text-[#303293] mt-0.5 mr-2 flex-shrink-0" />
                          <p className="text-sm">{intelligentDeliveryInfo}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-md border">
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 text-[#303293] mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium mb-1">How Intelligent Delivery works:</p>
                            <p className="text-sm text-gray-500">
                              Our intelligent system analyzes your past campaign performance and user behavior patterns
                              to determine the optimal delivery time for each user, maximizing engagement and conversion
                              rates.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center">
                        <BarChart className="h-4 w-4 text-[#303293] mr-2" />
                        <span className="text-xs text-gray-500">
                          Based on analysis of your past 90 days of campaign data
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#f3f0f4] p-4 rounded-lg border h-full flex items-center justify-center">
                      <div className="text-center max-w-xs">
                        <Info className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                        <h3 className="font-medium mb-1">Delivery Information</h3>
                        <p className="text-sm text-gray-500">
                          {deliveryType === "specific-time" && scheduledDate ? (
                            <>
                              Message will start sending {formatDateForDisplay(scheduledDate)} with a limit of ~1,000
                              per minute.
                            </>
                          ) : (
                            <>Message will start sending immediately with a limit of ~1,000 per minute.</>
                          )}
                        </p>

                        {currentVariant?.title && (
                          <p className="mt-4 text-sm text-[#303293]">
                            Select "Intelligent Delivery" to get AI-powered recommendations based on your notification
                            content and past performance data.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
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
