"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, AlertCircle, ArrowRight, RefreshCw, ThumbsUp, ThumbsDown, Trash2, ChevronLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import type { GenerationPrompt } from "@/lib/openai"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useSupabase } from "@/lib/use-supabase"

// Update the props interface to include variants
interface AINotificationGeneratorProps {
  onSelectNotification: (notification: { title: string; subtitle: string; body: string }, variantId?: string) => void
  onClose: () => void
  existingNotification?: {
    title: string
    subtitle: string
    message: string
  }
  variants?: Array<{
    id: string
    title: string
    subtitle: string
    message: string
    image: string
    url: string
  }>
  activeVariant?: string
  onDeleteVariant?: (variantId: string) => void
}

// Update the component to handle variants
export function AINotificationGenerator({
  onSelectNotification,
  onClose,
  existingNotification,
  variants,
  activeVariant,
  onDeleteVariant,
}: AINotificationGeneratorProps) {
  const router = useRouter()

  // Add this line to skip the Supabase configuration check
  const { isConfigured } = useSupabase(true)

  // Step tracking
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  // Input states
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputMethod, setInputMethod] = useState<"description" | "guided">("description")

  // Generated options
  const [generatedOptions, setGeneratedOptions] = useState<Array<{ title: string; subtitle: string; body: string }>>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Refinement
  const [refinementFeedback, setRefinementFeedback] = useState("")
  const [isRefining, setIsRefining] = useState(false)

  // A/B testing
  const [abTestVariants, setAbTestVariants] = useState<number | null>(null)
  const [generatedVariants, setGeneratedVariants] = useState<Array<{ title: string; subtitle: string; body: string }>>(
    [],
  )

  // Guided options
  const [prompt, setPrompt] = useState<GenerationPrompt>({
    industry: "ecommerce",
    tone: "friendly",
    goal: "engagement",
    audience: "existing customers",
    length: "short",
    includeEmoji: true,
  })

  // Add a new state for the variant being edited
  const [editingVariant, setEditingVariant] = useState<string | null>(null)

  // Add a state to track if we're in variants view mode
  const [showVariantsView, setShowVariantsView] = useState(false)

  // Add a new tab for variants if they exist
  const hasVariants = variants && variants.length > 1

  // Check if we have existing notification content
  useEffect(() => {
    if (existingNotification) {
      const hasContent =
        existingNotification.title.trim() !== "" ||
        existingNotification.subtitle.trim() !== "" ||
        existingNotification.message.trim() !== ""

      if (hasContent) {
        // Create a description from the existing content
        let contentDescription = "Generate variations of this notification: "
        if (existingNotification.title) contentDescription += `Title: ${existingNotification.title}. `
        if (existingNotification.subtitle) contentDescription += `Subtitle: ${existingNotification.subtitle}. `
        if (existingNotification.message) contentDescription += `Message: ${existingNotification.message}.`

        setDescription(contentDescription)

        // Generate variations immediately
        generateNotificationsFromExisting()
      }
    }

    // If we have variants, show the variants view by default
    if (hasVariants) {
      setShowVariantsView(true)
    }
  }, [existingNotification, hasVariants])

  const handlePromptChange = (field: keyof GenerationPrompt, value: any) => {
    setPrompt((prev) => {
      const newPrompt = { ...prev, [field]: value }

      // If we're on step 2 and have existing content, regenerate options
      if (currentStep === 2 && existingNotification) {
        setTimeout(() => generateNotificationsFromExisting(newPrompt), 100)
      }

      return newPrompt
    })
  }

  const generateNotificationsFromExisting = async (customPrompt?: GenerationPrompt) => {
    setIsGenerating(true)
    setError(null)

    try {
      const promptToUse = customPrompt || prompt

      // Prepare the request payload based on existing content
      const payload = {
        description: description,
        count: 3,
        tone: promptToUse.tone,
        length: promptToUse.length,
        includeEmoji: promptToUse.includeEmoji,
        existingContent: {
          title: existingNotification?.title || "",
          subtitle: existingNotification?.subtitle || "",
          message: existingNotification?.message || "",
        },
      }

      const response = await fetch("/api/generate-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.error) {
        console.warn("API returned an error:", data.error)
        setError(data.error)

        // Provide mock data for demonstration purposes
        setGeneratedOptions([
          {
            title: existingNotification?.title || "Flash Sale: 24 Hours Only! 🔥",
            subtitle: existingNotification?.subtitle || "Limited Time Offer",
            body: existingNotification?.message || "Exclusive deals up to 50% off. Shop now before they're gone!",
          },
          {
            title: existingNotification?.title ? `${existingNotification.title} - Variant` : "Your Cart Misses You 🛒",
            subtitle: existingNotification?.subtitle || "Items Waiting for You",
            body: existingNotification?.message
              ? `${existingNotification.message} (Alternative version)`
              : "Items in your cart are waiting. Complete your purchase today!",
          },
          {
            title: existingNotification?.title
              ? `${existingNotification.title} - Option 3`
              : "New Arrivals Just Dropped ✨",
            subtitle: existingNotification?.subtitle || "Fresh Collection",
            body: existingNotification?.message
              ? `${existingNotification.message} (Another version)`
              : "Be the first to shop our latest collection.",
          },
        ])
      } else if (data.notifications && data.notifications.length > 0) {
        setGeneratedOptions(data.notifications)
      } else {
        throw new Error("No notification data received")
      }

      // If we're already on step 2, don't change the step
      if (currentStep !== 2) {
        setCurrentStep(2)
      }

      // When generating notifications for a variant, we want to hide the variants view
      if (editingVariant) {
        setShowVariantsView(false)
      }
    } catch (error) {
      console.error("Error generating notifications:", error)
      setError(error instanceof Error ? error.message : "Failed to generate notifications")

      // Provide mock data for demonstration purposes
      setGeneratedOptions([
        {
          title: existingNotification?.title || "Flash Sale: 24 Hours Only! 🔥",
          subtitle: existingNotification?.subtitle || "Limited Time Offer",
          body: existingNotification?.message || "Exclusive deals up to 50% off. Shop now before they're gone!",
        },
        {
          title: existingNotification?.title ? `${existingNotification.title} - Variant` : "Your Cart Misses You 🛒",
          subtitle: existingNotification?.subtitle || "Items Waiting for You",
          body: existingNotification?.message
            ? `${existingNotification.message} (Alternative version)`
            : "Items in your cart are waiting. Complete your purchase today!",
        },
        {
          title: existingNotification?.title
            ? `${existingNotification.title} - Option 3`
            : "New Arrivals Just Dropped ✨",
          subtitle: existingNotification?.subtitle || "Fresh Collection",
          body: existingNotification?.message
            ? `${existingNotification.message} (Another version)`
            : "Be the first to shop our latest collection.",
        },
      ])

      // If we're already on step 2, don't change the step
      if (currentStep !== 2) {
        setCurrentStep(2)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const generateNotifications = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Prepare the request payload based on input method
      const payload =
        inputMethod === "description"
          ? { description, count: 3, tone: prompt.tone, length: prompt.length, includeEmoji: prompt.includeEmoji }
          : { ...prompt, count: 3 }

      const response = await fetch("/api/generate-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.error) {
        console.warn("API returned an error:", data.error)
        setError(data.error)

        // Provide mock data for demonstration purposes
        setGeneratedOptions([
          {
            title: "Flash Sale: 24 Hours Only! 🔥",
            subtitle: "Limited Time Offer",
            body: "Exclusive deals up to 50% off. Shop now before they're gone!",
          },
          {
            title: "Your Cart Misses You 🛒",
            subtitle: "Items Waiting for You",
            body: "Items in your cart are waiting. Complete your purchase today!",
          },
          {
            title: "New Arrivals Just Dropped ✨",
            subtitle: "Fresh Collection",
            body: "Be the first to shop our latest collection. Limited quantities available.",
          },
        ])
      } else if (data.notifications && data.notifications.length > 0) {
        setGeneratedOptions(data.notifications)
      } else {
        throw new Error("No notification data received")
      }

      // Move to the next step
      setCurrentStep(2)

      // Hide variants view when generating new notifications
      setShowVariantsView(false)
    } catch (error) {
      console.error("Error generating notifications:", error)
      setError(error instanceof Error ? error.message : "Failed to generate notifications")

      // Provide mock data for demonstration purposes
      setGeneratedOptions([
        {
          title: "Flash Sale: 24 Hours Only! 🔥",
          subtitle: "Limited Time Offer",
          body: "Exclusive deals up to 50% off. Shop now before they're gone!",
        },
        {
          title: "Your Cart Misses You 🛒",
          subtitle: "Items Waiting for You",
          body: "Items in your cart are waiting. Complete your purchase today!",
        },
        {
          title: "New Arrivals Just Dropped ✨",
          subtitle: "Fresh Collection",
          body: "Be the first to shop our latest collection. Limited quantities available.",
        },
      ])

      // Move to the next step despite the error
      setCurrentStep(2)
    } finally {
      setIsGenerating(false)
    }
  }

  const refineNotification = async () => {
    if (selectedOption === null) return

    setIsRefining(true)
    setError(null)

    try {
      const selectedNotification = generatedOptions[selectedOption]

      const response = await fetch("/api/refine-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedNotification.title,
          subtitle: selectedNotification.subtitle,
          body: selectedNotification.body,
          feedback: refinementFeedback,
        }),
      })

      const data = await response.json()

      if (data.error) {
        console.warn("API returned an error:", data.error)
        setError(data.error)

        // Provide mock refined data
        const refined = {
          title: selectedNotification.title,
          subtitle: selectedNotification.subtitle,
          body: "Refined: " + selectedNotification.body,
        }

        // Replace the selected option with the refined version
        const updatedOptions = [...generatedOptions]
        updatedOptions[selectedOption] = refined
        setGeneratedOptions(updatedOptions)
      } else if (data.notification) {
        // Replace the selected option with the refined version
        const updatedOptions = [...generatedOptions]
        updatedOptions[selectedOption] = data.notification
        setGeneratedOptions(updatedOptions)
      }

      // Clear the feedback field
      setRefinementFeedback("")
    } catch (error) {
      console.error("Error refining notification:", error)
      setError(error instanceof Error ? error.message : "Failed to refine notification")

      // Provide mock refined data
      const selectedNotification = generatedOptions[selectedOption]
      const refined = {
        title: selectedNotification.title,
        subtitle: selectedNotification.subtitle,
        body: "Refined: " + selectedNotification.body,
      }

      // Replace the selected option with the refined version
      const updatedOptions = [...generatedOptions]
      updatedOptions[selectedOption] = refined
      setGeneratedOptions(updatedOptions)
    } finally {
      setIsRefining(false)
    }
  }

  // Generate additional variants for A/B testing
  const generateVariants = async (count: number) => {
    if (selectedOption === null) return

    setIsGeneratingVariants(true)
    setError(null)

    try {
      const selectedNotification = generatedOptions[selectedOption]

      // Start with the selected notification as the first variant
      const variants = [selectedNotification]

      // Generate additional variants
      for (let i = 1; i < count; i++) {
        // In a real implementation, we would call the OpenAI API to generate each variant
        // For now, we'll simulate the API call with a timeout
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Create a variant based on the selected notification
        const variant = {
          title: `${selectedNotification.title} - Variant ${i + 1}`,
          subtitle: selectedNotification.subtitle,
          body: `${selectedNotification.body} (Alternative version ${i + 1})`,
        }

        variants.push(variant)
      }

      setGeneratedVariants(variants)

      // Redirect to the push creation page with all variants
      redirectWithVariants(variants)
    } catch (error) {
      console.error("Error generating variants:", error)
      setError(error instanceof Error ? error.message : "Failed to generate variants")

      // Provide mock variants for demonstration
      const selectedNotification = generatedOptions[selectedOption]
      const variants = [selectedNotification]

      for (let i = 1; i < count; i++) {
        variants.push({
          title: `${selectedNotification.title} - Variant ${i + 1}`,
          subtitle: selectedNotification.subtitle,
          body: `${selectedNotification.body} (Alternative version ${i + 1})`,
        })
      }

      setGeneratedVariants(variants)

      // Redirect to the push creation page with mock variants
      redirectWithVariants(variants)
    } finally {
      setIsGeneratingVariants(false)
    }
  }

  // Update the handleSelectNotification function to pass the variant ID
  const handleSelectOption = () => {
    if (selectedOption === null) return

    const selected = generatedOptions[selectedOption]

    // If editing a specific variant, pass that variant ID
    if (editingVariant) {
      onSelectNotification(selected, editingVariant)
      setEditingVariant(null)
      setShowVariantsView(true)
    } else if (!abTestVariants) {
      // If no A/B testing, just redirect with the selected notification
      redirectWithVariants([selected])
    } else {
      // Generate the requested number of variants
      generateVariants(abTestVariants)
    }
  }

  const redirectWithVariants = (variants: Array<{ title: string; subtitle: string; body: string }>) => {
    // Create URL parameters
    const params = new URLSearchParams()

    // Add the first variant (Variant A)
    params.append("title", variants[0].title)
    params.append("subtitle", variants[0].subtitle || "")
    params.append("body", variants[0].body)

    // Add the total number of variants
    params.append("variants", variants.length.toString())

    // Add additional variants starting from index 1
    for (let i = 1; i < variants.length; i++) {
      params.append(`title${i}`, variants[i].title)
      params.append(`subtitle${i}`, variants[i].subtitle || "")
      params.append(`body${i}`, variants[i].body)
    }

    // Close the panel and redirect
    onClose()
    router.push(`/push/create?${params.toString()}`)
  }

  const [finalTitle, setFinalTitle] = useState("")
  const [finalSubtitle, setFinalSubtitle] = useState("")
  const [finalBody, setFinalBody] = useState("")

  // Update the handleFinalSelection function to pass the variant ID
  const handleFinalSelection = () => {
    // Create the notification object
    const notification = {
      title: finalTitle,
      subtitle: finalSubtitle || "",
      body: finalBody,
    }

    // If editing a specific variant, pass that variant ID
    if (editingVariant) {
      onSelectNotification(notification, editingVariant)
      setEditingVariant(null)
      setShowVariantsView(true)
      return
    }

    // Option 1: Use the callback to pass data to parent component
    onSelectNotification(notification)

    // Option 2: Redirect to the push creation page with the notification data
    const params = new URLSearchParams()
    params.append("title", finalTitle)
    params.append("subtitle", finalSubtitle || "")
    params.append("body", finalBody)

    // If A/B testing is enabled, add variant count and additional variants
    if (abTestVariants) {
      params.append("variants", abTestVariants.toString())

      // Add other generated options as variants, starting from index 1 (since index 0 is already the main variant)
      let variantIndex = 1
      generatedOptions.forEach((option, index) => {
        // Skip the selected option since it's already the main variant (Variant A)
        if (index !== selectedOption && variantIndex < abTestVariants) {
          params.append(`title${variantIndex}`, option.title)
          params.append(`subtitle${variantIndex}`, option.subtitle || "")
          params.append(`body${variantIndex}`, option.body)
          variantIndex++
        }
      })
    }

    // Close the panel and redirect
    onClose()
    router.push(`/push/create?${params.toString()}`)
  }

  // Handle variant deletion
  const handleDeleteVariant = (variantId: string) => {
    if (onDeleteVariant) {
      onDeleteVariant(variantId)
    }
  }

  // Find the current variant being edited
  const currentEditingVariant = variants?.find((variant) => variant.id === editingVariant)

  // Handle back button click - return to variants view
  const handleBackToVariants = () => {
    setEditingVariant(null)
    setShowVariantsView(true)
    setCurrentStep(1) // Reset to step 1 to show the variants list
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            {!process.env.OPENAI_API_KEY && (
              <div className="mt-2">Please configure your OpenAI API key in the environment variables.</div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Show back button when editing a variant */}
      {editingVariant && (
        <button onClick={handleBackToVariants} className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to test variant list
        </button>
      )}

      {/* Show only the current variant being edited */}
      {editingVariant && currentEditingVariant && (
        <div className="border-2 border-indigo-500 rounded-lg p-4 mb-6 bg-indigo-50 bg-opacity-30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">
              Editing{" "}
              {editingVariant === "variant-a"
                ? "Variant A"
                : editingVariant === "variant-b"
                  ? "Variant B"
                  : `Variant ${editingVariant.split("-")[1].toUpperCase()}`}
            </h4>
            <Badge className="bg-indigo-600">Current</Badge>
          </div>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Title: </span>
              <span>{currentEditingVariant.title}</span>
            </div>
            {currentEditingVariant.subtitle && (
              <div>
                <span className="font-medium">Subtitle: </span>
                <span>{currentEditingVariant.subtitle}</span>
              </div>
            )}
            <div>
              <span className="font-medium">Message: </span>
              <span>{currentEditingVariant.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Show variants list when in variants view mode */}
      {showVariantsView && hasVariants && (
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-4">A/B Test Variants</h4>
          <div className="space-y-4">
            {variants?.map((variant) => (
              <div
                key={variant.id}
                className={`border rounded-lg p-4 ${variant.id === activeVariant ? "border-indigo-500 bg-indigo-50" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium">
                      {variant.id === "variant-a"
                        ? "Variant A"
                        : variant.id === "variant-b"
                          ? "Variant B"
                          : `Variant ${variant.id.split("-")[1].toUpperCase()}`}
                    </h5>
                    <p className="text-sm text-gray-500 mt-1">{variant.title}</p>
                    <p className="text-xs text-gray-400">{variant.message}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingVariant(variant.id)
                        setShowVariantsView(false)
                        // Set the description based on the variant content
                        setDescription(
                          `Generate variations of this notification: Title: ${variant.title}. Message: ${variant.message}`,
                        )
                        // Generate notifications for this variant
                        setTimeout(() => generateNotificationsFromExisting(), 100)
                      }}
                    >
                      Edit
                    </Button>
                    {variants && variants.length > 1 && (
                      <Button variant="outline" size="sm" onClick={() => handleDeleteVariant(variant.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add buttons to continue with other options */}
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowVariantsView(false)
                setCurrentStep(1)
              }}
              className="mr-2"
            >
              Create New Notification
            </Button>
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      )}

      {/* Step 1: Input - Only show if not in variants view */}
      {currentStep === 1 && !showVariantsView && (
        <div className="space-y-6">
          <h3 className="text-xl font-medium">What would you like to say?</h3>

          <Tabs
            defaultValue="description"
            onValueChange={(value) => {
              setInputMethod(value as "description" | "guided")
            }}
          >
            <TabsList className="w-full mb-6 bg-transparent p-0 border-b gap-2 justify-start">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Quick Description
              </TabsTrigger>
              <TabsTrigger
                value="guided"
                className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Guided Options
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Describe what you want to say</Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., Announce a flash sale with 30% off all products for the next 24 hours"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[120px]"
                      />

                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-2">Examples (click to use):</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Announce a 24-hour flash sale",
                            "Remind users about items in their cart",
                            "Promote a new product launch",
                            "Notify about account security",
                            "Invite to an upcoming event",
                          ].map((example, i) => (
                            <button
                              key={i}
                              onClick={() => setDescription(example)}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                            >
                              {example}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tone">Tone</Label>
                        <Select value={prompt.tone} onValueChange={(value) => handlePromptChange("tone", value)}>
                          <SelectTrigger id="tone">
                            <SelectValue placeholder="Select tone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="casual">Casual</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="humorous">Humorous</SelectItem>
                            <SelectItem value="formal">Formal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="length">Length</Label>
                        <Select
                          value={prompt.length}
                          onValueChange={(value) => handlePromptChange("length", value as "short" | "medium" | "long")}
                        >
                          <SelectTrigger id="length">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="short">Short (5-7 words)</SelectItem>
                            <SelectItem value="medium">Medium (8-12 words)</SelectItem>
                            <SelectItem value="long">Long (13-20 words)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={generateNotifications}
                      disabled={isGenerating || !description.trim()}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Options <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guided" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={prompt.industry} onValueChange={(value) => handlePromptChange("industry", value)}>
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="food">Food & Dining</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select value={prompt.tone} onValueChange={(value) => handlePromptChange("tone", value)}>
                        <SelectTrigger id="tone">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goal">Goal</Label>
                      <Select value={prompt.goal} onValueChange={(value) => handlePromptChange("goal", value)}>
                        <SelectTrigger id="goal">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="conversion">Conversion</SelectItem>
                          <SelectItem value="retention">Retention</SelectItem>
                          <SelectItem value="awareness">Awareness</SelectItem>
                          <SelectItem value="reactivation">Reactivation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Select value={prompt.audience} onValueChange={(value) => handlePromptChange("audience", value)}>
                        <SelectTrigger id="audience">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new users">New Users</SelectItem>
                          <SelectItem value="existing customers">Existing Customers</SelectItem>
                          <SelectItem value="inactive users">Inactive Users</SelectItem>
                          <SelectItem value="high value customers">High Value Customers</SelectItem>
                          <SelectItem value="young adults">Young Adults</SelectItem>
                          <SelectItem value="professionals">Professionals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="length">Length</Label>
                      <Select
                        value={prompt.length}
                        onValueChange={(value) => handlePromptChange("length", value as "short" | "medium" | "long")}
                      >
                        <SelectTrigger id="length">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (5-7 words)</SelectItem>
                          <SelectItem value="medium">Medium (8-12 words)</SelectItem>
                          <SelectItem value="long">Long (13-20 words)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="emoji"
                        checked={prompt.includeEmoji}
                        onCheckedChange={(checked) => handlePromptChange("includeEmoji", checked)}
                      />
                      <Label htmlFor="emoji">Include Emojis</Label>
                    </div>

                    <Button
                      onClick={generateNotifications}
                      disabled={isGenerating}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Options <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Step 2: Select or Refine */}
      {currentStep === 2 && !showVariantsView && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Select a notification or request refinements</h3>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>

          {/* Display original content */}
          {existingNotification && !editingVariant && (
            <div className="border-2 border-[#303293] rounded-lg p-4 mb-6 bg-[#ececfc] bg-opacity-30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Your Original Content</h4>
                <Badge className="bg-[#303293]">Original</Badge>
              </div>
              <div className="space-y-2">
                {existingNotification.title && (
                  <div>
                    <span className="font-medium">Title: </span>
                    <span>{existingNotification.title}</span>
                  </div>
                )}
                {existingNotification.subtitle && (
                  <div>
                    <span className="font-medium">Subtitle: </span>
                    <span>{existingNotification.subtitle}</span>
                  </div>
                )}
                {existingNotification.message && (
                  <div>
                    <span className="font-medium">Message: </span>
                    <span>{existingNotification.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tone and Length options for refining existing content */}
          {existingNotification && (
            <div className="bg-[#f3f0f4] bg-opacity-70 p-4 rounded-lg mb-4">
              <h4 className="font-medium mb-3">Refine options</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="refine-tone">Tone</Label>
                  <Select value={prompt.tone} onValueChange={(value) => handlePromptChange("tone", value)}>
                    <SelectTrigger id="refine-tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refine-length">Length</Label>
                  <Select
                    value={prompt.length}
                    onValueChange={(value) => handlePromptChange("length", value as "short" | "medium" | "long")}
                  >
                    <SelectTrigger id="refine-length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (5-7 words)</SelectItem>
                      <SelectItem value="medium">Medium (8-12 words)</SelectItem>
                      <SelectItem value="long">Long (13-20 words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Switch
                  id="refine-emoji"
                  checked={prompt.includeEmoji}
                  onCheckedChange={(checked) => handlePromptChange("includeEmoji", checked)}
                />
                <Label htmlFor="refine-emoji">Include Emojis</Label>
              </div>

              {isGenerating && (
                <div className="mt-2 flex items-center justify-center text-sm text-gray-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating options...
                </div>
              )}
            </div>
          )}

          <RadioGroup
            value={selectedOption !== null ? selectedOption.toString() : undefined}
            onValueChange={(value) => {
              setSelectedOption(Number.parseInt(value))
              const selected = generatedOptions[Number.parseInt(value)]
              setFinalTitle(selected.title)
              setFinalSubtitle(selected.subtitle || "")
              setFinalBody(selected.body)
            }}
          >
            {generatedOptions.map((option, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 mb-4 ${selectedOption === index ? "border-pink-500 bg-pink-50" : "border-gray-200"}`}
              >
                <div className="flex items-start">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                  <div className="ml-3 w-full">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`option-${index}`} className="font-medium text-lg">
                        {option.title}
                      </Label>
                      <Badge variant={index === 0 ? "default" : "outline"}>
                        {index === 0 ? "Recommended" : `Option ${index + 1}`}
                      </Badge>
                    </div>
                    {option.subtitle && <p className="text-sm text-gray-500 mt-1">{option.subtitle}</p>}
                    <p className="mt-1 text-gray-700">{option.body}</p>
                    <div className="flex justify-end mt-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>Rate this option:</span>
                        <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                          <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                        </button>
                        <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                          <ThumbsDown className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {selectedOption !== null && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Request refinements</h4>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe how you'd like to refine this notification (e.g., make it more urgent, add specific details, etc.)"
                  value={refinementFeedback}
                  onChange={(e) => setRefinementFeedback(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={refineNotification}
                  disabled={isRefining || !refinementFeedback.trim()}
                  className="w-full"
                >
                  {isRefining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Refining...
                    </>
                  ) : (
                    <>Refine Selected Option</>
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            {selectedOption !== null && !editingVariant && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    Create an A/B Test <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                    <DropdownMenuItem
                      key={count}
                      onClick={() => {
                        setAbTestVariants(count)
                      }}
                    >
                      {count} variants
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              onClick={handleSelectOption}
              disabled={selectedOption === null || isGeneratingVariants}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isGeneratingVariants ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Variants...
                </>
              ) : editingVariant ? (
                <>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Apply to{" "}
                  {editingVariant === "variant-a"
                    ? "Variant A"
                    : editingVariant === "variant-b"
                      ? "Variant B"
                      : `Variant ${editingVariant.split("-")[1].toUpperCase()}`}
                </>
              ) : (
                <>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {abTestVariants
                    ? `Use Selected Option for A/B Testing (${abTestVariants} variants)`
                    : "Use Selected Option"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
