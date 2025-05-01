"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Upload, Download, Filter, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const users = [
    {
      id: "u-1",
      email: "sarah.johnson@example.com",
      firstName: "Sarah",
      lastName: "Johnson",
      lastActive: "2 minutes ago",
      subscriptions: ["Push", "Email"],
      tags: ["Premium", "iOS"],
    },
    {
      id: "u-2",
      email: "michael.smith@example.com",
      firstName: "Michael",
      lastName: "Smith",
      lastActive: "1 hour ago",
      subscriptions: ["Push"],
      tags: ["Free Trial", "Android"],
    },
    {
      id: "u-3",
      email: "emma.wilson@example.com",
      firstName: "Emma",
      lastName: "Wilson",
      lastActive: "3 hours ago",
      subscriptions: ["Email", "SMS"],
      tags: ["Premium", "Web"],
    },
    {
      id: "u-4",
      email: "james.brown@example.com",
      firstName: "James",
      lastName: "Brown",
      lastActive: "1 day ago",
      subscriptions: ["Push", "Email", "SMS"],
      tags: ["Premium", "iOS"],
    },
    {
      id: "u-5",
      email: "olivia.davis@example.com",
      firstName: "Olivia",
      lastName: "Davis",
      lastActive: "2 days ago",
      subscriptions: ["Email"],
      tags: ["Free Trial", "Web"],
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
            <h1 className="text-2xl font-bold">Users</h1>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Import Users
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users"
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
                    <th className="text-left py-3 px-4 font-medium">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium">Subscriptions</th>
                    <th className="text-left py-3 px-4 font-medium">Tags</th>
                    <th className="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{user.lastActive}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.subscriptions.map((sub) => (
                            <span
                              key={sub}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {sub}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
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
              <div className="text-sm text-gray-500">Showing 5 of 1,245 users</div>
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
