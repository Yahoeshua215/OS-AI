"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Sparkles,
  Send,
  X,
  MessageSquare,
  BarChart,
  Users,
  TrendingUp,
  Zap,
  Clock,
  RefreshCw,
  Loader2,
} from "lucide-react"

type Message = {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

type SuggestedPrompt = {
  text: string
  icon: React.ReactNode
  category: string
}

export function IntelligencePanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm OneSignal Intelligence, your marketing assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Listen for the custom event to toggle the panel
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev)
    window.addEventListener("toggle-intelligence", handleToggle)
    return () => window.removeEventListener("toggle-intelligence", handleToggle)
  }, [])

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // In a real implementation, this would call the OpenAI API endpoint
      const response = await fetch("/api/intelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm not sure how to respond to that. Could you try asking in a different way?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)

      // Fallback to simulated response if API fails
      const fallbackResponse = await simulateAIResponse(input)

      const errorMessage: Message = {
        role: "assistant",
        content: fallbackResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Suggested prompts based on different categories
  const suggestedPrompts: SuggestedPrompt[] = [
    {
      text: "How can I improve my push notification open rates?",
      icon: <MessageSquare className="h-4 w-4" />,
      category: "engagement",
    },
    {
      text: "What segments should I create for my e-commerce app?",
      icon: <Users className="h-4 w-4" />,
      category: "segmentation",
    },
    {
      text: "Help me create a re-engagement journey for churned users",
      icon: <RefreshCw className="h-4 w-4" />,
      category: "journeys",
    },
    {
      text: "What's the best time to send notifications to my audience?",
      icon: <Clock className="h-4 w-4" />,
      category: "timing",
    },
    {
      text: "How can I increase conversion rates from my notifications?",
      icon: <TrendingUp className="h-4 w-4" />,
      category: "conversion",
    },
    {
      text: "Suggest A/B test ideas for my next campaign",
      icon: <Zap className="h-4 w-4" />,
      category: "testing",
    },
    {
      text: "What metrics should I focus on to measure campaign success?",
      icon: <BarChart className="h-4 w-4" />,
      category: "analytics",
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="bg-black/20 absolute inset-0" onClick={() => setIsOpen(false)}></div>

      <div className="relative w-full max-w-md bg-white shadow-lg flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Sparkles className="h-5 w-5 text-[#4346ce] mr-2" />
            OneSignal Intelligence
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user" ? "bg-[#4346ce] text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center mb-1">
                    <Sparkles className="h-4 w-4 text-[#4346ce] mr-1" />
                    <span className="text-xs font-medium">OneSignal Intelligence</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Suggested questions</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.slice(0, 4).map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt.text)}
                className="flex items-center gap-1 text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors"
              >
                {prompt.icon}
                <span className="truncate max-w-[150px]">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask OneSignal Intelligence..."
                className="resize-none min-h-[60px] pr-10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#4346ce] hover:bg-[#3638b2] text-white"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            OneSignal Intelligence provides marketing guidance based on industry best practices and your data.
          </p>
        </form>
      </div>
    </div>
  )
}

// This function simulates an AI response for demonstration purposes
// Used as a fallback if the API call fails
async function simulateAIResponse(input: string): Promise<string> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const lowerInput = input.toLowerCase()

  if (lowerInput.includes("open rate") || lowerInput.includes("open rates")) {
    return "Based on your current data, your average push notification open rate is 4.2%, which is slightly below the industry average of 5.5% for your sector.\n\nTo improve your open rates, I recommend:\n\n1. Personalize your notification titles with user names or preferences\n2. Use emojis strategically - your data shows a 22% higher open rate when you include them\n3. Send at optimal times - your audience is most active between 6-8pm on weekdays\n4. A/B test different notification styles to see what resonates\n\nWould you like me to help you set up an A/B test to improve your open rates?"
  }

  if (lowerInput.includes("segment") || lowerInput.includes("segments")) {
    return "For your e-commerce app, I recommend creating these key segments based on your user behavior data:\n\n1. High-Value Customers (spent >$100 in last 30 days)\n2. At-Risk Customers (previously active, no purchase in 30+ days)\n3. Cart Abandoners (added items but didn't complete purchase)\n4. New Users (joined in last 7 days)\n5. Discount Seekers (only purchase during promotions)\n\nYour data shows that targeting the At-Risk segment with personalized offers has the highest potential ROI. Would you like me to help you create any of these segments?"
  }

  if (lowerInput.includes("journey") || lowerInput.includes("re-engagement")) {
    return 'I can help you create a re-engagement journey for churned users. Based on your data, users who haven\'t engaged in 30+ days respond best to this sequence:\n\n1. Day 1: Send a "We miss you" push notification with personalized content\n2. Day 3: Send an email highlighting new features or products they might like\n3. Day 5: Offer a special discount or incentive via push notification\n4. Day 7: Final reminder email with the incentive expiration\n\nThis pattern has shown a 23% re-engagement rate for similar businesses. Would you like me to create this journey for you now?'
  }

  if (lowerInput.includes("time") || lowerInput.includes("timing") || lowerInput.includes("when")) {
    return "Based on your audience's engagement patterns over the past 30 days, the optimal times to send notifications are:\n\n• Weekdays: 7:30-8:30am and 6:00-8:00pm\n• Weekends: 10:00am-12:00pm and 7:00-9:00pm\n\nYour specific audience segments show different patterns:\n• Power users engage most in the evening (7-9pm)\n• New users respond better to morning notifications (8-10am)\n• Inactive users show higher re-engagement on weekends\n\nWould you like me to help you schedule your next campaign at these optimal times?"
  }

  if (lowerInput.includes("conversion") || lowerInput.includes("convert")) {
    return 'To increase conversion rates from your notifications, I recommend these data-backed strategies:\n\n1. Add clear CTAs - notifications with action verbs like "Shop," "Discover," or "Get" have 18% higher conversion rates in your campaigns\n\n2. Create urgency - limited-time offers show 31% higher conversion compared to standard promotions\n\n3. Personalize content - your segments with personalized recommendations convert at 2.4x the rate of generic messages\n\n4. Deep link directly to relevant pages - this reduces friction and improves conversion by 27%\n\nWould you like me to analyze your recent campaigns to identify specific improvement opportunities?'
  }

  if (lowerInput.includes("a/b test") || lowerInput.includes("ab test") || lowerInput.includes("testing")) {
    return 'Based on your campaign history, here are the most impactful A/B test ideas for your next campaign:\n\n1. Notification Timing: Test morning (8am) vs. evening (7pm) delivery\n\n2. Message Framing: Test loss aversion ("Don\'t miss out") vs. gain framing ("Discover new")\n\n3. Emoji Usage: Test with vs. without emojis in the title\n\n4. Personalization Level: Test generic vs. name personalization vs. behavior-based recommendations\n\n5. CTA Phrasing: Test direct ("Buy Now") vs. soft ("Learn More") calls to action\n\nYour historical data suggests that timing and personalization tests will likely yield the highest impact. Would you like me to help set up one of these tests?'
  }

  if (lowerInput.includes("metric") || lowerInput.includes("analytics") || lowerInput.includes("measure")) {
    return "For measuring campaign success, focus on these key metrics based on your business goals:\n\n1. Primary Metrics:\n   • Click-through Rate (CTR): Currently averaging 4.2%\n   • Conversion Rate: Currently at 1.8%\n   • Revenue per Message: Currently $0.12\n\n2. Secondary Metrics:\n   • Opt-out Rate: Keep below 0.5% (your current average is 0.3%)\n   • Engagement Time: How long users interact after clicking\n   • Retention Impact: Measure how campaigns affect 7/30-day retention\n\nYour data shows that CTR has less correlation with revenue than conversion rate. I recommend optimizing for conversion quality rather than just clicks.\n\nWould you like me to set up a custom dashboard focusing on these metrics?"
  }

  // Default response for other queries
  return "Thanks for your question. As your marketing assistant, I can help with campaign optimization, audience segmentation, journey creation, and performance analysis.\n\nBased on your recent campaigns, I notice opportunities to improve engagement through better timing and personalization. Your audience responds particularly well to messages sent between 6-8pm, and personalized content shows 40% higher engagement.\n\nHow would you like me to help you optimize your marketing strategy today?"
}
