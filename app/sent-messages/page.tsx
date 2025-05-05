"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronRight,
  Download,
  MessageSquare,
  FileText,
  MoreVertical,
  Sparkles,
  X,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Award,
  Zap,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for sent messages
const sentMessages = [
  {
    id: 1,
    type: "chat",
    name: "Lee",
    status: "Delivered",
    sentAt: "05/04/25, 1:15:15 am",
    sent: 1,
    ctr: "N/A",
    createdBy: {
      avatar: "/diverse-group.png",
      name: "Lee Smith",
    },
  },
  {
    id: 2,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 1:21:02 pm",
    sent: 1,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "System",
    },
  },
  {
    id: 3,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 1:20:54 pm",
    sent: 1,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "System",
    },
  },
  {
    id: 4,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 1:19:58 pm",
    sent: 1,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "System",
    },
  },
  {
    id: 5,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 11:23:56 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "System",
    },
  },
  {
    id: 6,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "No Recipients",
    sentAt: "05/02/25, 11:21:28 am",
    sent: 0,
    ctr: "N/A",
    createdBy: {
      avatar: "",
      name: "System",
    },
  },
  {
    id: 7,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "No Recipients",
    sentAt: "05/02/25, 11:19:51 am",
    sent: 0,
    ctr: "N/A",
    createdBy: {
      avatar: "",
      name: "System",
    },
  },
  {
    id: 8,
    type: "email",
    name: "Test message from catherine",
    status: "Delivered",
    sentAt: "05/02/25, 10:51:21 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "Catherine",
    },
  },
  {
    id: 9,
    type: "email",
    name: "Test from Jenny.",
    status: "Delivered",
    sentAt: "05/02/25, 10:50:33 am",
    sent: 4,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "Jenny",
    },
  },
  {
    id: 10,
    type: "email",
    name: "Hello from Olive",
    status: "Delivered",
    sentAt: "05/02/25, 10:50:19 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "Olive",
    },
  },
  {
    id: 11,
    type: "email",
    name: "Charles Postman Test",
    status: "Delivered",
    sentAt: "05/02/25, 10:49:55 am",
    sent: 6,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "Charles",
    },
  },
  {
    id: 12,
    type: "email",
    name: "Hello from Olive",
    status: "Delivered",
    sentAt: "05/02/25, 10:49:44 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "Olive",
    },
  },
  {
    id: 13,
    type: "email",
    name: "Hello from Braden",
    status: "Delivered",
    sentAt: "05/02/25, 10:49:40 am",
    sent: 7,
    ctr: "0.00%",
    createdBy: {
      avatar: "",
      name: "Braden",
    },
  },
]

export default function SentMessagesPage() {
  const [messageFilter, setMessageFilter] = useState("all")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [showInsightsPanel, setShowInsightsPanel] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [insightsGenerated, setInsightsGenerated] = useState(false)

  const handleOpenInsightsPanel = () => {
    setShowInsightsPanel(true)
    if (!insightsGenerated) {
      setIsGeneratingInsights(true)
      // Simulate generating insights
      setTimeout(() => {
        setIsGeneratingInsights(false)
        setInsightsGenerated(true)
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb and header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-gray-700">
            Demo Paid Org
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link href="/" className="hover:text-gray-700">
            ALL DEMO Testing
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Delivery</span>
        </div>
        <div className="flex justify-between items-center">
          {/* Simple H1 without the AI banner */}
          <h1 className="text-2xl font-bold text-gray-900">Sent Messages</h1>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="border-[#4346ce] text-[#4346ce] hover:bg-[#ececfc]"
              onClick={handleOpenInsightsPanel}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Insights
            </Button>
            <Button className="bg-[#4346ce] hover:bg-[#3a3db3]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Sent Messages Table Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center">
            <div className="flex items-center">
              <Select value={messageFilter} onValueChange={setMessageFilter}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="Messages: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Messages: All</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[180px] border-gray-300">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="link" className="text-[#4346ce] hover:text-[#3a3db3] px-2">
              More Filters
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="w-[80px]">Type</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[180px]">Sent At</TableHead>
                  <TableHead className="w-[80px] text-right">Sent</TableHead>
                  <TableHead className="w-[100px] text-right">CTR</TableHead>
                  <TableHead className="w-[120px]">Created By</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sentMessages.map((message) => (
                  <TableRow key={message.id} className="hover:bg-gray-50">
                    <TableCell>
                      {message.type === "chat" && (
                        <div className="bg-blue-100 p-1 rounded-md w-7 h-7 flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      {message.type === "push" && (
                        <div className="bg-gray-100 p-1 rounded-md w-7 h-7 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      {message.type === "email" && (
                        <div className="bg-gray-100 p-1 rounded-md w-7 h-7 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>
                      {message.status === "Delivered" ? (
                        <Badge className="bg-[#e7f6ee] text-[#2e905b] hover:bg-[#d7f0e3] hover:text-[#26774c]">
                          Delivered
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">No Recipients</Badge>
                      )}
                    </TableCell>
                    <TableCell>{message.sentAt}</TableCell>
                    <TableCell className="text-right">{message.sent}</TableCell>
                    <TableCell className="text-right">{message.ctr}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {message.createdBy.avatar ? (
                            <img
                              src={message.createdBy.avatar || "/placeholder.svg"}
                              alt={message.createdBy.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">{message.createdBy.name.charAt(0)}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Insights Side Panel */}
      {showInsightsPanel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="bg-black/20 absolute inset-0" onClick={() => setShowInsightsPanel(false)}></div>
          <div className="relative w-full max-w-3xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold flex items-center">
                <Sparkles className="h-5 w-5 text-[#4346ce] mr-2" />
                Message Insights
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setShowInsightsPanel(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isGeneratingInsights ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4346ce]"></div>
                  <p className="mt-4 text-gray-600">Analyzing your sent messages...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-gray-600">
                      AI-powered insights and recommendations based on your message performance.
                    </p>
                  </div>

                  <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
                      <TabsTrigger
                        value="overview"
                        className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#4346ce] data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span>Overview</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="engagement"
                        className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#4346ce] data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        <span>Engagement</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="recommendations"
                        className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-[#4346ce] data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        <span>Recommendations</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Key Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 bg-[#ececfc] rounded-lg">
                              <h3 className="font-medium text-[#14143c] mb-2 flex items-center">
                                <TrendingUp className="h-4 w-4 mr-2 text-[#4346ce]" />
                                Message Performance Summary
                              </h3>
                              <p className="text-gray-700">
                                Your messages have an average open rate of 62% and CTR of 4.87%, which is 12% higher
                                than industry average. Messages sent between 6PM-9PM have shown the highest engagement
                                rates.
                              </p>
                            </div>

                            <div className="p-4 bg-[#e7f6ee] rounded-lg">
                              <h3 className="font-medium text-[#2e905b] mb-2 flex items-center">
                                <MessageSquare className="h-4 w-4 mr-2 text-[#2e905b]" />
                                Common Themes
                              </h3>
                              <p className="text-gray-700">
                                Messages with personalized greetings perform 23% better than generic ones. Content
                                related to "testing" and "notifications" appears frequently in your messages.
                              </p>
                            </div>

                            <div className="p-4 bg-[#f6f7f8] rounded-lg border border-gray-200">
                              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                                <Users className="h-4 w-4 mr-2 text-gray-700" />
                                Audience Engagement
                              </h3>
                              <p className="text-gray-700">
                                Messages from "Jenny" and "Braden" have the highest engagement rates. Email messages
                                have a 15% higher CTR compared to push notifications.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Top Performing Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">Test from Jenny.</h4>
                                  <p className="text-sm text-gray-500">Sent on 05/02/25, 10:50:33 am</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">4 recipients</p>
                                  <p className="text-sm text-[#4346ce]">100% delivered</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">Charles Postman Test</h4>
                                  <p className="text-sm text-gray-500">Sent on 05/02/25, 10:49:55 am</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">6 recipients</p>
                                  <p className="text-sm text-[#4346ce]">100% delivered</p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <div className="flex justify-between">
                                <div>
                                  <h4 className="font-medium">Hello from Braden</h4>
                                  <p className="text-sm text-gray-500">Sent on 05/02/25, 10:49:40 am</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">7 recipients</p>
                                  <p className="text-sm text-[#4346ce]">100% delivered</p>
                                </div>
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
                              <p className="text-3xl font-bold text-[#4346ce]">4.87%</p>
                              <p className="text-green-500 text-sm">↑ 0.5% from last week</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <p className="text-gray-500 text-sm">Open Rate</p>
                              <p className="text-3xl font-bold text-[#4346ce]">62%</p>
                              <p className="text-green-500 text-sm">↑ 3% from last week</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <p className="text-gray-500 text-sm">Delivery Rate</p>
                              <p className="text-3xl font-bold text-[#4346ce]">85%</p>
                              <p className="text-red-500 text-sm">↓ 2% from last week</p>
                            </div>
                          </div>

                          <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">Engagement by Time of Day</h3>
                            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
                              <div className="text-center w-full px-4">
                                <div className="flex items-end justify-between h-32 gap-1">
                                  {[20, 35, 45, 30, 50, 65, 40].map((value, i) => (
                                    <div
                                      key={i}
                                      className="w-12 bg-[#4346ce] rounded-t flex-1"
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
                          </div>

                          <div className="mt-8">
                            <h3 className="text-lg font-medium mb-4">Engagement by Message Type</h3>
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <span className="w-24 text-sm">Email</span>
                                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="bg-[#4346ce] h-full rounded-full" style={{ width: "65%" }}></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">65%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-24 text-sm">Push</span>
                                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="bg-[#4346ce] h-full rounded-full" style={{ width: "48%" }}></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">48%</span>
                              </div>
                              <div className="flex items-center">
                                <span className="w-24 text-sm">Chat</span>
                                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="bg-[#4346ce] h-full rounded-full" style={{ width: "72%" }}></div>
                                </div>
                                <span className="ml-2 text-sm font-medium">72%</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="recommendations" className="mt-6 space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>AI-Powered Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {[
                              {
                                title: "Optimize Send Time",
                                description:
                                  "Your audience is most active between 6PM and 9PM. Schedule your notifications during this window to increase engagement.",
                                icon: <Clock className="h-5 w-5 text-[#4346ce]" />,
                                action: "Schedule Campaign",
                              },
                              {
                                title: "Improve Message Content",
                                description:
                                  "Messages with personalized greetings have 23% higher engagement. Include the recipient's name in your messages when possible.",
                                icon: <Zap className="h-5 w-5 text-[#4346ce]" />,
                                action: "Edit Templates",
                              },
                              {
                                title: "Target Inactive Users",
                                description:
                                  "Create a segment for users who haven't engaged in 30+ days and send a re-engagement campaign.",
                                icon: <Users className="h-5 w-5 text-[#4346ce]" />,
                                action: "Create Segment",
                              },
                              {
                                title: "A/B Test Your CTAs",
                                description:
                                  "Your 'Test from Jenny' message performed 15% better than similar messages. Consider testing more variations of your call-to-action.",
                                icon: <Award className="h-5 w-5 text-[#4346ce]" />,
                                action: "Create A/B Test",
                              },
                            ].map((recommendation, index) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-start">
                                  <div className="bg-[#ececfc] p-2 rounded-full mr-4">{recommendation.icon}</div>
                                  <div className="flex-1">
                                    <h3 className="font-medium text-lg">{recommendation.title}</h3>
                                    <p className="text-gray-600 mb-4">{recommendation.description}</p>
                                    <div className="flex justify-end">
                                      <Button className="bg-[#4346ce] hover:bg-[#3a3db3] text-white">
                                        {recommendation.action}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 p-4 bg-[#ececfc] rounded-lg border border-[#c0c1f5]">
                            <h3 className="font-medium text-lg flex items-center">
                              <Sparkles className="h-5 w-5 text-[#4346ce] mr-2" />
                              AI-Generated Message Template
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Based on your highest performing messages, we suggest this template:
                            </p>
                            <div className="bg-white p-4 rounded-lg border border-[#c0c1f5]">
                              <p className="font-medium">Hi [Name], we've got something special for you!</p>
                              <p className="text-sm text-gray-500 mt-1">
                                We noticed you've been interested in [Product]. Check out our latest update with new
                                features you'll love!
                              </p>
                              <div className="flex justify-end mt-2">
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>Rate this suggestion:</span>
                                  <button className="p-1 hover:bg-[#ececfc] rounded-full transition-colors">
                                    <ThumbsUp className="h-4 w-4 text-gray-500 hover:text-[#4346ce]" />
                                  </button>
                                  <button className="p-1 hover:bg-[#ececfc] rounded-full transition-colors">
                                    <ThumbsDown className="h-4 w-4 text-gray-500 hover:text-[#4346ce]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button className="bg-[#4346ce] hover:bg-[#3a3db3] text-white">Use This Template</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span>Powered by OneSignal AI</span>
                </div>
                <Button variant="outline" className="border-[#4346ce] text-[#4346ce] hover:bg-[#ececfc]">
                  Export Insights
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
