"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, MoreVertical, Bell, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const subscriptions = [
    {
      id: "sub-1",
      user: {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
      },
      type: "Push",
      status: "Active",
      device: "iPhone 13",
      createdAt: "Jan 15, 2023",
      lastActive: "2 minutes ago",
    },
    {
      id: "sub-2",
      user: {
        name: "Michael Smith",
        email: "michael.smith@example.com",
      },
      type: "Push",
      status: "Active",
      device: "Samsung Galaxy S21",
      createdAt: "Feb 3, 2023",
      lastActive: "1 hour ago",
    },
    {
      id: "sub-3",
      user: {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
      },
      type: "Email",
      status: "Active",
      device: "N/A",
      createdAt: "Mar 12, 2023",
      lastActive: "3 hours ago",
    },
    {
      id: "sub-4",
      user: {
        name: "James Brown",
        email: "james.brown@example.com",
      },
      type: "SMS",
      status: "Inactive",
      device: "N/A",
      createdAt: "Apr 5, 2023",
      lastActive: "1 day ago",
    },
    {
      id: "sub-5",
      user: {
        name: "Olivia Davis",
        email: "olivia.davis@example.com",
      },
      type: "Email",
      status: "Active",
      device: "N/A",
      createdAt: "May 20, 2023",
      lastActive: "2 days ago",
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
            <h1 className="text-2xl font-bold">Subscriptions</h1>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subscriptions"
                  className="pl-10 h-10 border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">User</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Device</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Last Active</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((subscription) => (
                    <tr key={subscription.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{subscription.user.name}</div>
                          <div className="text-sm text-gray-500">{subscription.user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {subscription.type === "Push" ? (
                            <Bell className="h-4 w-4 mr-2 text-indigo-500" />
                          ) : subscription.type === "Email" ? (
                            <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                          ) : (
                            <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                          )}
                          {subscription.type}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscription.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {subscription.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{subscription.device}</td>
                      <td className="py-3 px-4 text-gray-500">{subscription.createdAt}</td>
                      <td className="py-3 px-4 text-gray-500">{subscription.lastActive}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">Showing 5 of 985 subscriptions</div>
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
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 ml-1">
                  ›
                </Button>
              </nav>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
