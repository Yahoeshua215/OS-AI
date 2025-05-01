"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, UserCheck, UserX } from "lucide-react"
import Link from "next/link"

export default function AudiencePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>Acme Org</span>
            <span className="mx-2">›</span>
            <span>Demo App</span>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Audience</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/segments">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Segments</CardTitle>
                  <Users className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Create and manage audience segments based on user behavior, attributes, and engagement patterns.
                  </p>
                  <div className="mt-4 flex items-center text-sm text-indigo-600">
                    <span>6 segments</span>
                    <span className="mx-2">•</span>
                    <span>4 active</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/audience/users">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Users</CardTitle>
                  <UserPlus className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    View and manage individual user profiles, including their subscription status and message history.
                  </p>
                  <div className="mt-4 flex items-center text-sm text-indigo-600">
                    <span>1,245 total users</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/audience/subscriptions">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Subscriptions</CardTitle>
                  <UserCheck className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Manage user subscriptions across different channels including push, email, and SMS.
                  </p>
                  <div className="mt-4 flex items-center text-sm text-indigo-600">
                    <span>985 active subscriptions</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {[
                    {
                      action: "New user subscribed",
                      channel: "Push",
                      time: "2 minutes ago",
                      icon: <UserPlus className="h-4 w-4 text-green-500" />,
                    },
                    {
                      action: "User unsubscribed",
                      channel: "Email",
                      time: "1 hour ago",
                      icon: <UserX className="h-4 w-4 text-red-500" />,
                    },
                    {
                      action: "Segment 'Active Users' updated",
                      channel: "System",
                      time: "3 hours ago",
                      icon: <Users className="h-4 w-4 text-indigo-500" />,
                    },
                    {
                      action: "Imported 50 new users",
                      channel: "System",
                      time: "Yesterday",
                      icon: <UserPlus className="h-4 w-4 text-indigo-500" />,
                    },
                    {
                      action: "New user subscribed",
                      channel: "SMS",
                      time: "Yesterday",
                      icon: <UserPlus className="h-4 w-4 text-green-500" />,
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center p-4">
                      <div className="mr-4">{item.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium">{item.action}</p>
                        <p className="text-sm text-gray-500">Channel: {item.channel}</p>
                      </div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
