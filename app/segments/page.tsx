"use client"

import { useState, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Upload, Plus, Clock, Users, Mail, Smartphone, List, MoreVertical, MessageSquare } from "lucide-react"
import Link from "next/link"
import { NewSegmentPanel } from "@/components/new-segment-panel"
import { Badge } from "@/components/ui/badge"
import React from "react"
import { ChevronRight, ChevronDown, Bell, Activity, CircleCheck, Edit, Send } from "lucide-react"

export default function SegmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newSegmentPanelOpen, setNewSegmentPanelOpen] = useState(false)
  const [expandedSegments, setExpandedSegments] = useState({})

  const toggleSegmentExpansion = useCallback((segmentIndex) => {
    setExpandedSegments((prevState) => ({
      ...prevState,
      [segmentIndex]: !prevState[segmentIndex],
    }))
  }, [])

  const segmentTemplates = [
    {
      title: "First-time Audience",
      description: "Connect with new contacts that joined in the past 3 hours",
      icon: <Clock className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Regional Audience",
      description: "Contact your active audience from a specified country",
      icon: <Users className="h-6 w-6 text-indigo-600" />,
    },
    {
      title: "Custom Audience",
      description: "Reach targeted audience based on user properties or events from data tags",
      icon: <List className="h-6 w-6 text-indigo-600" />,
    },
  ]

  const subscriptionSegments = [
    {
      name: "Total Subscriptions",
      status: "Active",
      description: "All active subscriptions across all channels",
      type: "subscription",
    },
    {
      name: "Inactive Subscriptions",
      status: "Active",
      description: "Last Session greater than 168 hours ago\nNo activity in the last 7 days",
      type: "subscription",
    },
    {
      name: "Engaged Subscriptions",
      status: "Active",
      description:
        "Last Session less than 168 hours ago\nSession count is greater than 4 sessions\nHas opened at least 2 notifications",
      type: "subscription",
    },
    {
      name: "Opened Email Recently",
      status: "Processing",
      description: "Any email has been clicked at least 2 times within last 7 days\nUser has active email subscription",
      type: "user",
    },
    {
      name: "All Email Subscriptions",
      status: "Paused",
      description: "Device Type is Email\nSubscription status is Active",
      type: "subscription",
    },
    {
      name: "Active Users",
      status: "Active",
      description:
        "Last Session less than 168 hours ago\nHas at least one active subscription\nHas completed onboarding",
      type: "user",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Acme Org</span>
            <span className="mx-2">›</span>
            <span>Demo App</span>
            <span className="mx-2">›</span>
            <Link href="/audience" className="hover:text-gray-700">
              Audience
            </Link>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Segments</h1>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Update/Import Users
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center"
                onClick={() => setNewSegmentPanelOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Segment
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <details className="bg-white rounded-lg shadow border p-4">
              <summary className="text-indigo-600 font-medium cursor-pointer flex items-center">
                Try one of our quickstart segments
              </summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {segmentTemplates.map((template, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-white">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-medium text-lg">{template.title}</h3>
                      <div className="bg-indigo-100 p-2 rounded-full">{template.icon}</div>
                    </div>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                    {template.title === "Custom Audience" && (
                      <div className="flex justify-between mb-4">
                        <Button variant="outline" className="text-indigo-600 border-indigo-600">
                          <Upload className="h-4 w-4 mr-2" />
                          Import data tags
                        </Button>
                      </div>
                    )}
                    <Button className="w-full">Create</Button>
                  </div>
                ))}
              </div>
            </details>
          </div>

          <div className="bg-white rounded-lg shadow">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
                <TabsTrigger
                  value="all"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  All <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">6</span>
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Active <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">4</span>
                </TabsTrigger>
                <TabsTrigger
                  value="paused"
                  className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Paused <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">2</span>
                </TabsTrigger>
              </TabsList>

              <div className="p-4">
                <div className="relative w-full max-w-md mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or keywords"
                    className="pl-10 h-10 border-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionSegments.map((segment, index) => {
                        const isUserBased = segment.type === "user"
                        const isExpanded = !!expandedSegments[index]

                        return (
                          <React.Fragment key={index}>
                            <tr
                              className={`border-b hover:bg-gray-50 cursor-pointer ${isExpanded ? "bg-gray-50" : ""}`}
                              onClick={() => toggleSegmentExpansion(index)}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {isExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="font-medium">{segment.name}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    segment.status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : segment.status === "Paused"
                                        ? "bg-gray-100 text-gray-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {segment.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant={isUserBased ? "secondary" : "outline"} className="font-normal">
                                  {isUserBased ? "User-based" : "Channel-based"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>

                            {isExpanded && (
                              <tr className="bg-gray-50">
                                <td colSpan={4} className="py-0">
                                  <div className="px-10 py-4 border-b">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                      <div className="bg-white p-3 rounded-lg border">
                                        <div className="text-sm text-gray-500 mb-1">Channel Counts</div>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div>
                                            <div className="flex items-center">
                                              <Bell className="h-4 w-4 mr-1 text-indigo-500" />
                                              <span className="text-sm font-medium">Push</span>
                                            </div>
                                            <div className="text-xl font-semibold">
                                              {Math.floor(Math.random() * 10000)}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="flex items-center">
                                              <MessageSquare className="h-4 w-4 mr-1 text-indigo-500" />
                                              <span className="text-sm font-medium">SMS</span>
                                            </div>
                                            <div className="text-xl font-semibold">
                                              {Math.floor(Math.random() * 5000)}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="flex items-center">
                                              <Mail className="h-4 w-4 mr-1 text-indigo-500" />
                                              <span className="text-sm font-medium">Email</span>
                                            </div>
                                            <div className="text-xl font-semibold">
                                              {Math.floor(Math.random() * 8000)}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-white p-3 rounded-lg border">
                                        <div className="text-sm text-gray-500 mb-1">User Metrics</div>
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <div className="flex items-center">
                                              <Users className="h-4 w-4 mr-1 text-indigo-500" />
                                              <span className="text-sm font-medium">Total Users</span>
                                            </div>
                                            <div className="text-xl font-semibold">
                                              {Math.floor(Math.random() * 15000)}
                                            </div>
                                          </div>
                                          <div>
                                            <div className="flex items-center">
                                              <Activity className="h-4 w-4 mr-1 text-indigo-500" />
                                              <span className="text-sm font-medium">Active</span>
                                            </div>
                                            <div className="text-xl font-semibold">
                                              {Math.floor(Math.random() * 8000)}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="bg-white p-3 rounded-lg border">
                                        <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                                        <div className="text-xl font-semibold">
                                          {new Date().toLocaleDateString()}{" "}
                                          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">Auto-updates every 24 hours</div>
                                      </div>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg border">
                                      <div className="text-sm font-medium mb-2">Segment Definition</div>
                                      {segment.description ? (
                                        <div className="text-sm text-gray-700">
                                          {segment.description.split("\n").map((line, i) => (
                                            <div key={i} className="flex items-center py-1">
                                              {line.includes("Last Session") ? (
                                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                              ) : line.includes("Device Type") ? (
                                                <Smartphone className="h-4 w-4 mr-2 text-gray-500" />
                                              ) : line.includes("Session count") ? (
                                                <List className="h-4 w-4 mr-2 text-gray-500" />
                                              ) : line.includes("email") ? (
                                                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                                              ) : (
                                                <CircleCheck className="h-4 w-4 mr-2 text-gray-500" />
                                              )}
                                              {line}
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-sm text-gray-500">
                                          No specific filters defined. This segment includes all subscriptions.
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex justify-end mt-4 space-x-2">
                                      <Button variant="outline" size="sm" className="flex items-center">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Segment
                                      </Button>
                                      <Button variant="outline" size="sm" className="flex items-center">
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Message
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center mt-6">
                  <nav className="flex items-center">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 mr-1" disabled>
                      ‹
                    </Button>
                    <Button variant="default" size="sm" className="h-8 w-8 p-0 bg-indigo-600">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 mx-1">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 mx-1">
                      3
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 mx-1">
                      4
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 mx-1">
                      5
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 ml-1">
                      ›
                    </Button>
                  </nav>
                </div>
              </div>
            </Tabs>
          </div>
        </main>
      </div>
      <NewSegmentPanel open={newSegmentPanelOpen} onClose={() => setNewSegmentPanelOpen(false)} />
    </div>
  )
}
