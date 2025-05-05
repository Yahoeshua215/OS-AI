"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BarChart,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Award,
  Zap,
  Send,
  Loader2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"

interface AIInsightsPanelProps {
  open: boolean
  onClose: () => void
}

export function AIInsightsPanel({ open, onClose }: AIInsightsPanelProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [question, setQuestion] = useState("")
  const [isAsking, setIsAsking] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)

  if (!open) return null

  // Function to handle asking a question
  const handleAskQuestion = () => {
    if (!question.trim()) return

    setIsAsking(true)
    setAiResponse(null)

    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a response based on the question
      let response = ""
      const lowerQuestion = question.toLowerCase()

      if (lowerQuestion.includes("best time")) {
        response =
          "Based on your audience's engagement patterns, the optimal time to send push notifications is between 6PM and 9PM on weekdays. During this time, your open rates average 65% compared to 42% at other times."
      } else if (lowerQuestion.includes("ctr") || lowerQuestion.includes("click")) {
        response =
          "Your average CTR over the past 30 days is 4.87%, which is 12% higher than the industry average of 4.35%. Your best performing notification had a CTR of 8.2% with the title 'Flash Sale: 24 Hours Only! 🔥'."
      } else if (lowerQuestion.includes("emoji")) {
        response =
          "Notifications containing emojis have shown a 23% higher engagement rate compared to those without. The most effective emojis in your campaigns have been: 🔥, 🎁, and ✨."
      } else if (lowerQuestion.includes("improve") || lowerQuestion.includes("better")) {
        response =
          "To improve your push notification performance, consider: 1) Using more urgent language in your titles, 2) Adding relevant emojis, 3) Sending during peak hours (6PM-9PM), and 4) Personalizing content based on user behavior."
      } else {
        response =
          "Based on your push notification data, I can see that your campaigns have an average open rate of 62% and CTR of 4.87%. Your most successful notifications use urgency-based language and emojis. Consider scheduling more notifications during peak engagement hours (6PM-9PM) and implementing A/B testing to optimize your content."
      }

      setAiResponse(response)
      setIsAsking(false)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="bg-black/20 absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-3xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Activity className="h-5 w-5 text-pink-500 mr-2" />
            Message Insights
          </h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-gray-600">Insights and recommendations based on your message performance.</p>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="engagement"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center"
              >
                <BarChart className="h-4 w-4 mr-2" />
                <span>Engagement</span>
              </TabsTrigger>
              <TabsTrigger
                value="recommendations"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-pink-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center"
              >
                <Zap className="h-4 w-4 mr-2" />
                <span>Recommendations</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              {/* Question Prompt */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Ask about your messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Input
                      placeholder="E.g., What's the best time to send notifications?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAskQuestion()
                        }
                      }}
                    />
                    <Button
                      className="bg-[#4346ce] hover:bg-[#3638b2] text-white"
                      onClick={handleAskQuestion}
                      disabled={isAsking || !question.trim()}
                    >
                      {isAsking ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Ask
                        </>
                      )}
                    </Button>
                  </div>

                  {aiResponse && (
                    <div className="mt-4 p-4 bg-[#f0f0ff] rounded-lg border border-[#e0e0ff]">
                      <p className="text-gray-700">{aiResponse}</p>
                      <div className="flex justify-end mt-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Was this helpful?</span>
                          <button className="p-1 hover:bg-[#e0e0ff] rounded-full transition-colors">
                            <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-[#4346ce]" />
                          </button>
                          <button className="p-1 hover:bg-[#e0e0ff] rounded-full transition-colors">
                            <ThumbsDown className="h-4 w-4 text-gray-500 hover:text-[#4346ce]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!aiResponse && !isAsking && (
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Suggested questions:</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          "What's the best time to send messages?",
                          "How can I improve my CTR?",
                          "Do emojis affect engagement?",
                          "How can I make my messages better?",
                        ].map((q, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setQuestion(q)
                            }}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Key Insights - Updated to use white metric cards */}
              <div>
                <h3 className="text-lg font-medium mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 p-2 rounded-full bg-[#f0f0ff]">
                          <BarChart className="h-5 w-5 text-[#4346ce]" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Average CTR</p>
                        <p className="text-3xl font-bold text-[#4346ce]">4.87%</p>
                        <p className="text-green-500 text-xs flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> 0.5% from last week
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 p-2 rounded-full bg-[#f0f0ff]">
                          <Activity className="h-5 w-5 text-[#4346ce]" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Open Rate</p>
                        <p className="text-3xl font-bold text-[#4346ce]">62%</p>
                        <p className="text-green-500 text-xs flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" /> 3% from last week
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-2 p-2 rounded-full bg-[#f0f0ff]">
                          <Users className="h-5 w-5 text-[#4346ce]" />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                        <p className="text-3xl font-bold text-[#4346ce]">2.3%</p>
                        <p className="text-red-500 text-xs flex items-center mt-1">
                          <TrendingDown className="h-3 w-3 mr-1" /> 0.2% from last week
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Weekly Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-gray-500 mb-2">CTR Trend</p>
                        <div className="flex items-end justify-center h-20 gap-1">
                          {[4.2, 3.8, 5.1, 4.7, 6.2, 5.3, 4.8].map((value, i) => (
                            <div
                              key={i}
                              className="w-6 bg-blue-500 rounded-t"
                              style={{ height: `${value * 10}px` }}
                            ></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Delivery Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center">
                              <span className="text-xl font-bold">85%</span>
                            </div>
                            <span className="mt-2 text-sm">Delivered</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border-8 border-orange-400 flex items-center justify-center">
                              <span className="text-xl font-bold">10%</span>
                            </div>
                            <span className="mt-2 text-sm">Bounced</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full border-8 border-yellow-400 flex items-center justify-center">
                              <span className="text-xl font-bold">5%</span>
                            </div>
                            <span className="mt-2 text-sm">Failed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Optimal Send Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center w-full px-4">
                      <div className="flex items-end justify-between h-32 gap-1">
                        {[20, 35, 45, 30, 50, 65, 40].map((value, i) => (
                          <div
                            key={i}
                            className="w-12 bg-pink-500 rounded-t flex-1"
                            style={{ height: `${value}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>6am</span>
                        <span>9am</span>
                        <span>12pm</span>
                        <span>3pm</span>
                        <span>6pm</span>
                        <span>9pm</span>
                        <span>12am</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-500 text-sm">Average CTR</p>
                      <p className="text-3xl font-bold text-pink-500">4.87%</p>
                      <p className="text-green-500 text-sm">↑ 0.5% from last week</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-500 text-sm">Open Rate</p>
                      <p className="text-3xl font-bold text-pink-500">62%</p>
                      <p className="text-green-500 text-sm">↑ 3% from last week</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-gray-500 text-sm">Conversion Rate</p>
                      <p className="text-3xl font-bold text-pink-500">2.3%</p>
                      <p className="text-red-500 text-sm">↓ 0.2% from last week</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Top Performing Notifications</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Flash Sale: 24 Hours Only! 🔥",
                          ctr: "8.2%",
                          opens: "78%",
                        },
                        {
                          title: "Your Cart Misses You 🛒",
                          ctr: "6.7%",
                          opens: "65%",
                        },
                        {
                          title: "New Arrivals Just Dropped ✨",
                          ctr: "5.9%",
                          opens: "70%",
                        },
                      ].map((notification, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-gray-500">Sent on May 12, 2023</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm">
                                CTR: <span className="font-medium text-pink-500">{notification.ctr}</span>
                              </p>
                              <p className="text-sm">
                                Opens: <span className="font-medium text-pink-500">{notification.opens}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Optimize Send Time",
                        description:
                          "Your audience is most active between 6PM and 9PM. Consider scheduling your notifications during this window.",
                        icon: <Clock className="h-5 w-5 text-pink-500" />,
                        action: "Schedule Campaign",
                      },
                      {
                        title: "Improve Message Content",
                        description:
                          "Notifications with emojis have 23% higher engagement. Try adding relevant emojis to your titles.",
                        icon: <Zap className="h-5 w-5 text-pink-500" />,
                        action: "Edit Templates",
                      },
                      {
                        title: "Target Inactive Users",
                        description:
                          "Create a segment for users who haven't engaged in 30+ days and send a re-engagement campaign.",
                        icon: <Users className="h-5 w-5 text-pink-500" />,
                        action: "Create Segment",
                      },
                      {
                        title: "A/B Test Your CTAs",
                        description:
                          "Your 'Limited Time' messages perform 15% better than others. Consider testing more urgency-based CTAs.",
                        icon: <Award className="h-5 w-5 text-pink-500" />,
                        action: "Create A/B Test",
                      },
                    ].map((recommendation, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="bg-pink-50 p-2 rounded-full mr-4">{recommendation.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lg">{recommendation.title}</h3>
                            <p className="text-gray-600 mb-4">{recommendation.description}</p>
                            <div className="flex justify-end">
                              <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                                {recommendation.action}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <h3 className="font-medium text-lg flex items-center">
                      <Zap className="h-5 w-5 text-pink-500 mr-2" />
                      Generated Notification Suggestion
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Based on your audience behavior and top-performing notifications, we suggest:
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-pink-200">
                      <p className="font-medium">Limited Time: 40% Off Your Favorites! 🎁</p>
                      <p className="text-sm text-gray-500">
                        Your favorite items are on sale for the next 24 hours. Shop now before they're gone!
                      </p>
                      <div className="flex justify-end mt-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>Rate this suggestion:</span>
                          <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                            <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                          </button>
                          <button className="p-1 hover:bg-pink-100 rounded-full transition-colors">
                            <ThumbsDown className="h-4 w-4 text-gray-500 hover:text-pink-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button className="bg-pink-500 hover:bg-pink-600 text-white">Use This Template</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              <span>Powered by OneSignal</span>
            </div>
            <Button variant="outline" className="border-pink-500 text-pink-500 hover:bg-pink-50">
              Export Insights
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
