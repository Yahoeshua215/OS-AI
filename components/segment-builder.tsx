"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  GripVertical,
  Clock,
  Users,
  MessageSquare,
  Globe,
  Tag,
  DollarSign,
  ShoppingCart,
  Activity,
  Info,
  X,
  Sparkles,
  Loader2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import type { SegmentFilter } from "@/types/segment-types"

interface SegmentBuilderProps {
  initialFilters: SegmentFilter[]
  initialName?: string
  onSave: (name: string, filters: SegmentFilter[]) => void
  onClose: () => void
}

export function SegmentBuilder({ initialFilters, initialName, onSave, onClose }: SegmentBuilderProps) {
  const [segmentName, setSegmentName] = useState(initialName || `Segment ${new Date().toLocaleDateString()}`)
  const [filters, setFilters] = useState<SegmentFilter[]>(initialFilters || [])
  const [operators, setOperators] = useState<string[]>([]) // Array of operators between filters
  const [draggedFilter, setDraggedFilter] = useState<string | null>(null)
  const [estimatedCount, setEstimatedCount] = useState<string>("Calculating...")
  const [segmentType, setSegmentType] = useState<"subscription" | "user">("subscription")
  const [activeFilterTab, setActiveFilterTab] = useState<"channel" | "user">("channel")
  const [aiPromptExpanded, setAiPromptExpanded] = useState<boolean>(false)
  const [aiPromptDescription, setAiPromptDescription] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  // Add these new state variables after the existing state declarations
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false)
  const [draggedFilterType, setDraggedFilterType] = useState<string | null>(null)

  // Add channel counts
  const [channelCounts, setChannelCounts] = useState({
    push: "0",
    email: "0",
    sms: "0",
    inApp: "0",
  })

  // Initialize operators array when filters change
  useEffect(() => {
    // We need (filters.length - 1) operators to connect filters
    if (filters.length > 1 && operators.length < filters.length - 1) {
      const newOperators = [...operators]
      while (newOperators.length < filters.length - 1) {
        newOperators.push("AND") // Default to AND
      }
      setOperators(newOperators)
    }
  }, [filters, operators])

  // Group filters by type
  const subscriptionBasedFilters = [
    {
      id: "first-session",
      type: "First Session",
      description: "The first date/time the device communicated with our servers",
      icon: <Clock className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "last-session",
      type: "Last Session",
      description: "The most recent date/time the device communicated with our servers",
      icon: <Clock className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "session-count",
      type: "Session Count",
      description: "Total number of times the device has opened your app or website",
      icon: <Users className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "language",
      type: "Language",
      description: "The language of the user's device",
      icon: <Globe className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "user-tag",
      type: "User Tag",
      description: "Tags you have added to the user's device",
      icon: <Tag className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "location",
      type: "Location",
      description: "Radius in meters from a particular geocoordinate (lat, long)",
      icon: <Globe className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "country",
      type: "Country",
      description: "Country the device was in the last time it communicated with our servers",
      icon: <Globe className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "amount-spent",
      type: "Amount Spent",
      description: "The amount the user has spent on In-App Purchases",
      icon: <DollarSign className="h-4 w-4" />,
      category: "subscription",
    },
    {
      id: "purchased-item",
      type: "Purchased Item",
      description: "Filter by code of In-App Purchase item",
      icon: <ShoppingCart className="h-4 w-4" />,
      category: "subscription",
    },
  ]

  const userBasedFilters = [
    {
      id: "message-event",
      type: "Message Event",
      description: "Filter by message interactions across all channels",
      icon: <MessageSquare className="h-4 w-4" />,
      category: "user",
    },
    {
      id: "custom-event",
      type: "Custom Event",
      description: "Filter by custom events tracked in your application",
      icon: <Activity className="h-4 w-4" />,
      category: "user",
    },
  ]

  // Combine all filters
  const availableFilters = [...subscriptionBasedFilters, ...userBasedFilters]

  // Check if segment contains any user-based filters
  useEffect(() => {
    const hasUserBasedFilter = filters.some(
      (filter) => filter.type === "Message Event" || filter.type === "Custom Event",
    )

    setSegmentType(hasUserBasedFilter ? "user" : "subscription")
  }, [filters])

  // Simulate calculating the estimated count
  useEffect(() => {
    const timer = setTimeout(() => {
      const total = Math.floor(Math.random() * 10000)
      setEstimatedCount(total.toString())

      // Generate random counts for each channel that sum up to the total
      const push = Math.floor(total * 0.4)
      const email = Math.floor(total * 0.3)
      const sms = Math.floor(total * 0.2)
      const inApp = total - push - email - sms

      setChannelCounts({
        push: push.toString(),
        email: email.toString(),
        sms: sms.toString(),
        inApp: inApp.toString(),
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [filters, operators])

  const handleAddFilter = (filterId: string) => {
    const filterToAdd = availableFilters.find((f) => f.id === filterId)
    if (!filterToAdd) return

    let newFilter: SegmentFilter = {
      id: `${filterId}-${Date.now()}`,
      type: filterToAdd.type,
    }

    // Set default values based on filter type
    switch (filterId) {
      case "first-session":
      case "last-session":
        newFilter = {
          ...newFilter,
          operator: "is less than",
          value: "7",
          unit: "days ago",
        }
        break
      case "session-count":
        newFilter = {
          ...newFilter,
          operator: "is greater than",
          value: "0",
        }
        break
      case "language":
        newFilter = {
          ...newFilter,
          operator: "is",
          value: "English",
        }
        break
      case "message-event":
        newFilter = {
          ...newFilter,
          messageType: "Any push notification",
          operator: "has been received",
          count: "at least",
          value: "1",
          timeframe: "within",
          timeValue: "7",
          timeUnit: "days",
        }
        break
      case "custom-event":
        newFilter = {
          ...newFilter,
          eventName: "app_open",
          operator: "has occurred",
          count: "at least",
          value: "1",
          timeframe: "within",
          timeValue: "30",
          timeUnit: "days",
        }
        break
      case "amount-spent":
        newFilter = {
          ...newFilter,
          operator: "is greater than",
          value: "0",
        }
        break
      case "purchased-item":
        newFilter = {
          ...newFilter,
          operator: "exists",
        }
        break
    }

    // Add the new filter
    setFilters([...filters, newFilter])

    // If this isn't the first filter, add a default operator
    if (filters.length > 0) {
      setOperators([...operators, "AND"])
    }

    // Recalculate estimate
    setEstimatedCount("Calculating...")
    setTimeout(() => {
      setEstimatedCount(Math.floor(Math.random() * 10000).toString())
    }, 1000)
  }

  const handleRemoveFilter = (index: number) => {
    // Remove the filter
    const newFilters = [...filters]
    newFilters.splice(index, 1)
    setFilters(newFilters)

    // If we're removing a filter that's not the last one, we need to adjust operators
    if (index < operators.length) {
      const newOperators = [...operators]
      newOperators.splice(index, 1)
      setOperators(newOperators)
    } else if (index > 0 && index === filters.length - 1) {
      // If we're removing the last filter and it's not the only one, remove the last operator
      const newOperators = [...operators]
      newOperators.pop()
      setOperators(newOperators)
    }

    // Recalculate estimate
    setEstimatedCount("Calculating...")
    setTimeout(() => {
      setEstimatedCount(Math.floor(Math.random() * 10000).toString())
    }, 1000)
  }

  const handleUpdateFilter = (id: string, updates: Partial<SegmentFilter>) => {
    setFilters(
      filters.map((filter) => {
        if (filter.id === id) {
          return { ...filter, ...updates }
        }
        return filter
      }),
    )
    // Recalculate estimate
    setEstimatedCount("Calculating...")
    setTimeout(() => {
      setEstimatedCount(Math.floor(Math.random() * 10000).toString())
    }, 1000)
  }

  const handleToggleOperator = (index: number) => {
    const newOperators = [...operators]
    newOperators[index] = newOperators[index] === "AND" ? "OR" : "AND"
    setOperators(newOperators)

    // Recalculate estimate
    setEstimatedCount("Calculating...")
    setTimeout(() => {
      setEstimatedCount(Math.floor(Math.random() * 10000).toString())
    }, 1000)
  }

  const handleDragStart = (id: string, filterType: string) => {
    // Store just the filter ID without any timestamp
    setDraggedFilter(id)
    setDraggedFilterType(filterType)

    // Set data for HTML5 drag and drop API
    // This helps with cross-browser compatibility
    const event = window.event as DragEvent
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", id)
      event.dataTransfer.effectAllowed = "copy"
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isDraggingOver) {
      setIsDraggingOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDraggingOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)

    if (!draggedFilter) return

    // Get the filter ID from our state
    const filterId = draggedFilter

    // Simply call handleAddFilter with the dragged filter ID
    // This will create the filter with default values
    handleAddFilter(filterId)

    // Reset drag state
    setDraggedFilter(null)
    setDraggedFilterType(null)
  }

  const handleSave = () => {
    if (!segmentName.trim()) {
      alert("Please enter a segment name")
      return
    }

    if (filters.length === 0) {
      alert("Please add at least one filter")
      return
    }

    // Call the onSave prop to save the segment
    onSave(segmentName, filters)

    // Show success message
    alert(`Segment "${segmentName}" has been created successfully!`)
  }

  const handleGenerateFilters = async () => {
    if (!aiPromptDescription.trim()) return

    setIsGenerating(true)
    setAiResponse(null)

    try {
      // In a real implementation, this would call an API to generate segment filters
      // For now, we'll simulate a response after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate filters based on the description
      let newFilters: SegmentFilter[] = []

      if (aiPromptDescription.toLowerCase().includes("active users")) {
        newFilters = [
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
        ]
        setAiResponse(
          "I've created a segment for active users who have opened your app in the last 7 days and have at least 3 sessions.",
        )
      } else if (
        aiPromptDescription.toLowerCase().includes("purchased") ||
        aiPromptDescription.toLowerCase().includes("buy")
      ) {
        newFilters = [
          {
            id: `purchased-item-${Date.now()}`,
            type: "Purchased Item",
            operator: "exists",
          },
          {
            id: `amount-spent-${Date.now()}`,
            type: "Amount Spent",
            operator: "is greater than",
            value: "0",
          },
        ]
        setAiResponse("I've created a segment for users who have made at least one purchase in your app.")
      } else if (aiPromptDescription.toLowerCase().includes("english")) {
        newFilters = [
          {
            id: `language-${Date.now()}`,
            type: "Language",
            operator: "is",
            value: "English",
          },
        ]
        setAiResponse("I've created a segment for users who have their device language set to English.")
      } else if (
        aiPromptDescription.toLowerCase().includes("notification") ||
        aiPromptDescription.toLowerCase().includes("message")
      ) {
        newFilters = [
          {
            id: `message-event-${Date.now()}`,
            type: "Message Event",
            messageType: "Any push notification",
            operator: "has been received",
            count: "at least",
            value: "1",
            timeframe: "within",
            timeValue: "7",
            timeUnit: "days",
          },
        ]
        setAiResponse(
          "I've created a segment for users who have received at least one push notification in the last 7 days.",
        )
      } else {
        // Default segment for new users
        newFilters = [
          {
            id: `first-session-${Date.now()}`,
            type: "First Session",
            operator: "is less than",
            value: "30",
            unit: "days ago",
          },
        ]
        setAiResponse(
          "Based on your description, I've created a segment for new users who joined in the last 30 days. You can refine this further in the segment builder.",
        )
      }

      // Add the new filters to the existing filters
      setFilters([...filters, ...newFilters])

      // If this isn't the first filter, add default operators
      if (filters.length > 0) {
        const newOperators = [...operators]
        for (let i = 0; i < newFilters.length; i++) {
          newOperators.push("AND")
        }
        setOperators(newOperators)
      }

      // Recalculate estimate
      setEstimatedCount("Calculating...")
      setTimeout(() => {
        setEstimatedCount(Math.floor(Math.random() * 10000).toString())
      }, 1000)

      // Close the AI prompt after successful generation
      setTimeout(() => {
        setAiPromptExpanded(false)
      }, 3000)
    } catch (err) {
      console.error("Error generating segment filters:", err)
      setAiResponse("Failed to generate segment filters. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Function to group filters based on operators
  const getFilterGroups = () => {
    if (filters.length === 0) return []

    // Start with the first filter in the first group
    const groups: { filters: SegmentFilter[]; operator?: string }[] = [{ filters: [filters[0]] }]

    // Group subsequent filters based on operators
    for (let i = 0; i < operators.length; i++) {
      const currentOperator = operators[i]

      if (currentOperator === "OR") {
        // Start a new group when we encounter an OR
        groups.push({ filters: [filters[i + 1]], operator: "OR" })
      } else {
        // Add to the current group for AND
        groups[groups.length - 1].filters.push(filters[i + 1])
      }
    }

    return groups
  }

  const filterGroups = getFilterGroups()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1 mr-4">
          <Label htmlFor="segment-name" className="text-base font-medium">
            Name of segment <span className="text-red-500">*</span>
          </Label>
          <Input
            id="segment-name"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            className="max-w-xl"
            required
          />
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 flex items-center justify-end">
            {segmentType === "subscription" ? "Subscribed Channel Records" : "Users"} (estimate)
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0 ml-1">
                    <Info className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="w-64">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Channel Breakdown</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Push:</span>
                        <span className="font-medium">{channelCounts.push}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{channelCounts.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SMS:</span>
                        <span className="font-medium">{channelCounts.sms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In-App:</span>
                        <span className="font-medium">{channelCounts.inApp}</span>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-2xl font-semibold">{estimatedCount}</div>
          <div className="mt-1">
            <Badge variant={segmentType === "subscription" ? "outline" : "secondary"} className="font-normal text-xs">
              {segmentType === "subscription" ? "Channel-based" : "User-based"}
            </Badge>
          </div>
        </div>
      </div>

      {/* AI Prompt Banner */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="bg-indigo-50 py-2 px-3 flex items-center justify-between cursor-pointer"
          onClick={() => setAiPromptExpanded(!aiPromptExpanded)}
        >
          <h3 className="text-sm text-gray-700">Describe the type of segment you would like to have</h3>
          <div className="flex items-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 px-2 rounded flex items-center"
              onClick={(e) => {
                e.stopPropagation()
                setAiPromptExpanded(true)
              }}
            >
              Select
              <Sparkles className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>

        {aiPromptExpanded && (
          <div className="p-4 bg-white border-b">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-prompt">Tell us what kind of segment you want to create</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="e.g., Active users who have opened the app in the last week, Users who have received push notifications, English-speaking users who have made a purchase"
                  value={aiPromptDescription}
                  onChange={(e) => setAiPromptDescription(e.target.value)}
                  className="min-h-[100px]"
                />

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Examples (click to use):</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Active users in the last 7 days",
                      "Users who have received push notifications",
                      "English-speaking users",
                      "Users who have made a purchase",
                      "New users who joined recently",
                    ].map((example, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          setAiPromptDescription(example)
                        }}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleGenerateFilters()
                }}
                disabled={isGenerating || !aiPromptDescription.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Segment Filters
                  </>
                )}
              </Button>

              {aiResponse && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-start">
                    <Sparkles className="h-5 w-5 text-indigo-600 mt-0.5 mr-2" />
                    <div className="flex-1">
                      <p className="text-gray-700">{aiResponse}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {segmentType === "user" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium text-sm">This is a user-based segment</p>
            <p className="text-blue-700 text-xs mt-0.5">
              Your segment includes user-based filters (Message Events or Custom Events). This means results will be
              counted by unique users rather than by individual channel subscriptions.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side: Available Filters */}
        <div className="md:w-1/3 border rounded-lg bg-white overflow-hidden">
          <div className="p-3 border-b">
            <h3 className="text-sm font-medium">Available Filters</h3>
            <p className="text-xs text-gray-500 mt-0.5">Drag filters to the builder area or click to add</p>
            <Tabs
              value={activeFilterTab}
              onValueChange={(value) => setActiveFilterTab(value as "channel" | "user")}
              className="mt-2"
            >
              <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="channel"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Channel Events
                </TabsTrigger>
                <TabsTrigger
                  value="user"
                  className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  User Events
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="h-[calc(100vh-220px)] overflow-y-auto p-3">
            {activeFilterTab === "channel" ? (
              <div className="space-y-2">
                {subscriptionBasedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="border rounded-lg p-2 flex items-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddFilter(filter.id)}
                    draggable
                    onDragStart={() => handleDragStart(filter.id, filter.type)}
                  >
                    <div className="bg-indigo-100 p-1.5 rounded-full mr-2">{filter.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{filter.type}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{filter.description}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-indigo-600 h-7 w-7 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {userBasedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="border rounded-lg p-2 flex items-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddFilter(filter.id)}
                    draggable
                    onDragStart={() => handleDragStart(filter.id, filter.type)}
                  >
                    <div className="bg-blue-100 p-1.5 rounded-full mr-2">{filter.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm flex items-center">
                        {filter.type}
                        <Badge variant="secondary" className="ml-1 font-normal text-xs py-0 px-1.5">
                          User-based
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">{filter.description}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 h-7 w-7 p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Builder Area */}
        <div className="md:w-2/3">
          <h3 className="text-sm font-medium mb-2">
            {segmentType === "subscription"
              ? "Channel subscriptions in this segment must meet these rules:"
              : "Users in this segment must meet these rules:"}
          </h3>

          <div className="border rounded-lg overflow-hidden">
            <div
              className={`min-h-[400px] bg-gray-50 p-4 ${
                isDraggingOver ? "border-2 border-dashed border-indigo-400 bg-indigo-50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {filters.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  {isDraggingOver ? (
                    <>
                      <div className="text-indigo-500 font-medium mb-2">Drop to add filter</div>
                      <div className="border-2 border-dashed border-indigo-300 rounded-lg p-8 w-full text-center">
                        Release to add {draggedFilterType} filter
                      </div>
                    </>
                  ) : (
                    'Drag and drop filters here or click "Add filter" below'
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filterGroups.map((group, groupIndex) => (
                    <React.Fragment key={`group-${groupIndex}`}>
                      {/* Group operator (except for the first group) */}
                      {groupIndex > 0 && (
                        <div className="flex justify-center my-2">
                          <button
                            onClick={() => handleToggleOperator(groupIndex - 1)}
                            className={`px-6 py-1.5 text-sm font-medium rounded-full transition-colors ${
                              group.operator === "OR"
                                ? "bg-orange-100 text-orange-700 hover:bg-orange-200 border-2 border-orange-300"
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-2 border-indigo-300"
                            }`}
                          >
                            {group.operator}
                          </button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 p-0 ml-1">
                                  <Info className="h-3 w-3 text-gray-400" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="w-64">
                                <p className="text-xs">
                                  Click to toggle between AND/OR.
                                  <br />
                                  <strong>AND</strong>: Users must match both groups of filters.
                                  <br />
                                  <strong>OR</strong>: Users must match either group of filters.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}

                      {/* Filter group */}
                      <div
                        className={`border-2 rounded-lg p-3 ${
                          group.operator === "OR" ? "border-orange-300 bg-orange-50" : "border-indigo-200 bg-white"
                        }`}
                      >
                        {/* Group label */}
                        <div className="mb-2 flex items-center">
                          <span className="text-xs font-medium text-gray-500">
                            {groupIndex === 0 ? "Match ALL of the following:" : "OR match ALL of the following:"}
                          </span>
                        </div>

                        {/* Filters in this group */}
                        <div className="space-y-3">
                          {group.filters.map((filter, filterIndex) => {
                            // Calculate the absolute index of this filter in the overall filters array
                            let absoluteFilterIndex = 0
                            for (let i = 0; i < groupIndex; i++) {
                              absoluteFilterIndex += filterGroups[i].filters.length
                            }
                            absoluteFilterIndex += filterIndex

                            return (
                              <React.Fragment key={filter.id}>
                                {/* Filter */}
                                <div
                                  className={`bg-white border rounded-lg p-4 flex items-start ${
                                    filter.type === "Message Event" || filter.type === "Custom Event"
                                      ? "border-blue-200"
                                      : ""
                                  }`}
                                  draggable
                                  onDragStart={() => handleDragStart(filter.id, filter.type)}
                                >
                                  <div className="mr-2 cursor-move">
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <span className="font-medium">{filter.type}</span>
                                      {(filter.type === "Message Event" || filter.type === "Custom Event") && (
                                        <Badge variant="secondary" className="ml-2 font-normal text-xs">
                                          User-based
                                        </Badge>
                                      )}
                                    </div>

                                    {filter.type === "Language" && (
                                      <div className="flex flex-wrap gap-2 items-center">
                                        <Select
                                          value={filter.operator}
                                          onValueChange={(value) => handleUpdateFilter(filter.id, { operator: value })}
                                        >
                                          <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="is">is</SelectItem>
                                            <SelectItem value="is not">is not</SelectItem>
                                          </SelectContent>
                                        </Select>

                                        <Select
                                          value={filter.value}
                                          onValueChange={(value) => handleUpdateFilter(filter.id, { value })}
                                        >
                                          <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Select language" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="English">English</SelectItem>
                                            <SelectItem value="Spanish">Spanish</SelectItem>
                                            <SelectItem value="French">French</SelectItem>
                                            <SelectItem value="German">German</SelectItem>
                                            <SelectItem value="Japanese">Japanese</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}

                                    {(filter.type === "First Session" || filter.type === "Last Session") && (
                                      <div className="flex flex-wrap gap-2 items-center">
                                        <Select
                                          value={filter.operator}
                                          onValueChange={(value) => handleUpdateFilter(filter.id, { operator: value })}
                                        >
                                          <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="is less than">is less than</SelectItem>
                                            <SelectItem value="is greater than">is greater than</SelectItem>
                                            <SelectItem value="is exactly">is exactly</SelectItem>
                                          </SelectContent>
                                        </Select>

                                        <Input
                                          type="number"
                                          value={filter.value}
                                          onChange={(e) => handleUpdateFilter(filter.id, { value: e.target.value })}
                                          className="w-[80px]"
                                        />

                                        <Select
                                          value={filter.unit}
                                          onValueChange={(value) => handleUpdateFilter(filter.id, { unit: value })}
                                        >
                                          <SelectTrigger className="w-[120px]">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="days ago">days ago</SelectItem>
                                            <SelectItem value="hours ago">hours ago</SelectItem>
                                            <SelectItem value="minutes ago">minutes ago</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}

                                    {filter.type === "Session Count" && (
                                      <div className="flex flex-wrap gap-2 items-center">
                                        <Select
                                          value={filter.operator}
                                          onValueChange={(value) => handleUpdateFilter(filter.id, { operator: value })}
                                        >
                                          <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Select" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="is less than">is less than</SelectItem>
                                            <SelectItem value="is greater than">is greater than</SelectItem>
                                            <SelectItem value="is exactly">is exactly</SelectItem>
                                          </SelectContent>
                                        </Select>

                                        <Input
                                          type="number"
                                          value={filter.value}
                                          onChange={(e) => handleUpdateFilter(filter.id, { value: e.target.value })}
                                          className="w-[80px]"
                                        />
                                      </div>
                                    )}

                                    {filter.type === "Message Event" && (
                                      <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2 items-center">
                                          <Select
                                            value={filter.messageType}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { messageType: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[200px]">
                                              <SelectValue placeholder="Select message type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Any push notification">
                                                Any push notification
                                              </SelectItem>
                                              <SelectItem value="Any email">Any email</SelectItem>
                                              <SelectItem value="Any SMS">Any SMS</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Select
                                            value={filter.operator}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { operator: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[150px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="has been received">has been received</SelectItem>
                                              <SelectItem value="has been clicked">has been clicked</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="flex flex-wrap gap-2 items-center">
                                          <Select
                                            value={filter.count}
                                            onValueChange={(value) => handleUpdateFilter(filter.id, { count: value })}
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="at least">at least</SelectItem>
                                              <SelectItem value="at most">at most</SelectItem>
                                              <SelectItem value="exactly">exactly</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Input
                                            type="number"
                                            value={filter.value}
                                            onChange={(e) => handleUpdateFilter(filter.id, { value: e.target.value })}
                                            className="w-[80px]"
                                          />

                                          <span>times</span>

                                          <Select
                                            value={filter.timeframe}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { timeframe: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="within">within</SelectItem>
                                              <SelectItem value="before">before</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Input
                                            type="number"
                                            value={filter.timeValue}
                                            onChange={(e) =>
                                              handleUpdateFilter(filter.id, { timeValue: e.target.value })
                                            }
                                            className="w-[80px]"
                                          />

                                          <Select
                                            value={filter.timeUnit}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { timeUnit: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="days">days</SelectItem>
                                              <SelectItem value="hours">hours</SelectItem>
                                              <SelectItem value="minutes">minutes</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )}

                                    {filter.type === "Custom Event" && (
                                      <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2 items-center">
                                          <Select
                                            value={filter.eventName}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { eventName: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[200px]">
                                              <SelectValue placeholder="Select event" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="app_open">App Open</SelectItem>
                                              <SelectItem value="purchase">Purchase</SelectItem>
                                              <SelectItem value="add_to_cart">Add to Cart</SelectItem>
                                              <SelectItem value="page_view">Page View</SelectItem>
                                              <SelectItem value="login">Login</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Select
                                            value={filter.operator}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { operator: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[150px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="has occurred">has occurred</SelectItem>
                                              <SelectItem value="has not occurred">has not occurred</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="flex flex-wrap gap-2 items-center">
                                          <Select
                                            value={filter.count}
                                            onValueChange={(value) => handleUpdateFilter(filter.id, { count: value })}
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="at least">at least</SelectItem>
                                              <SelectItem value="at most">at most</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Input
                                            type="number"
                                            value={filter.value}
                                            onChange={(e) => handleUpdateFilter(filter.id, { value: e.target.value })}
                                            className="w-[80px]"
                                          />

                                          <span>times</span>

                                          <Select
                                            value={filter.timeframe}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { timeframe: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="within">within</SelectItem>
                                              <SelectItem value="before">before</SelectItem>
                                            </SelectContent>
                                          </Select>

                                          <Input
                                            type="number"
                                            value={filter.timeValue}
                                            onChange={(e) =>
                                              handleUpdateFilter(filter.id, { timeValue: e.target.value })
                                            }
                                            className="w-[80px]"
                                          />

                                          <Select
                                            value={filter.timeUnit}
                                            onValueChange={(value) =>
                                              handleUpdateFilter(filter.id, { timeUnit: value })
                                            }
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="days">days</SelectItem>
                                              <SelectItem value="hours">hours</SelectItem>
                                              <SelectItem value="minutes">minutes</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFilter(absoluteFilterIndex)}
                                    className="text-gray-400 hover:text-red-500 h-7 w-7 p-0"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* AND operator between filters within the same group */}
                                {filterIndex < group.filters.length - 1 && (
                                  <div className="flex justify-center my-2">
                                    <span className="px-4 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                      AND
                                    </span>
                                  </div>
                                )}
                              </React.Fragment>
                            )
                          })}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 text-right">
              <Button variant="secondary" className="mr-2" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Segment</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
