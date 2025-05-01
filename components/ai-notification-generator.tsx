"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, AlertCircle, ArrowRight, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import type { GenerationPrompt } from "@/lib/openai"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
// Update the import to include the useSupabase hook
import { useSupabase } from "@/lib/use-supabase"

interface AINotificationGeneratorProps {
  onSelectNotification: (notification: { title: string; subtitle: string; body: string }) => void
  onClose: () => void
}

export function AINotificationGenerator({ onSelectNotification, onClose }: AINotificationGeneratorProps) {
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

  const handlePromptChange = (field: keyof GenerationPrompt, value: any) => {
    setPrompt((prev) => ({ ...prev, [field]: value }))
  }

  const generateNotifications = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Prepare the request payload based on input method
      const payload =
        inputMethod === "description"
          ? { description, count: 3, tone: prompt.tone, length: prompt.length }
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

  const handleSelectOption = () => {
    if (selectedOption === null) return

    const selected = generatedOptions[selectedOption]

    // If no A/B testing, just redirect with the selected notification
    if (!abTestVariants) {
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

  const handleFinalSelection = () => {
    // Create the notification object
    const notification = {
      title: finalTitle,
      subtitle: finalSubtitle || "",
      body: finalBody,
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

      {/* Step 1: Input */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-medium">What would you like to say?</h3>

          <Tabs defaultValue="description" onValueChange={(value) => setInputMethod(value as "description" | "guided")}>
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
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium">Select a notification or request refinements</h3>
            <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)} className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>

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
            {selectedOption !== null && (
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
