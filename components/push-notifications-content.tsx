"use client"

import { useState } from "react"
import { Search, Filter, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Sample data for push notifications
const notifications = [
  {
    id: 1,
    name: "Uh-oh, your prescription is expiring",
    status: "Draft",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "N/A",
  },
  {
    id: 2,
    name: "You're missing out on points",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 3,
    name: "[URGENT] You've got ONE DAY to watch...",
    status: "Cancelled",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "N/A",
  },
  {
    id: 4,
    name: "Your 7-figure plan goes bye-bye at...",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 5,
    name: "[WEEKEND ONLY] Get this NOW before it's...",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 6,
    name: "Mary, earn double points today only",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 7,
    name: "Unlock New Investment Opportunities",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 8,
    name: "Your weekly wealth check-in",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 9,
    name: "Complimentary gift wrap on all purchases",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 10,
    name: "Seasonal savings are here",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 11,
    name: "Ready for a new adventure?",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 12,
    name: "Challenge yourself—join now!",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 13,
    name: "Get more kitchen space with these easy...",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
  {
    id: 14,
    name: "Hey, forget something? Here's 20% off",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "N/A",
    ctr: "32.6%",
  },
  {
    id: 15,
    name: "Your weekend watchlist is here!",
    status: "Delivered",
    sentAt: "1/11/25, 1:11:00 pm",
    createdAt: "1/11/25, 1:11:00 pm",
    delivered: "56k",
    ctr: "32.6%",
  },
]

export function PushNotificationsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Calculate pagination
  const totalPages = Math.ceil(notifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = notifications.slice(startIndex, endIndex)

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
          <TabsTrigger
            value="all"
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              activeTab === "all" && "border-indigo-600 font-medium",
            )}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Sent
          </TabsTrigger>
          <TabsTrigger
            value="scheduled"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Scheduled
          </TabsTrigger>
          <TabsTrigger
            value="drafts"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Drafts
          </TabsTrigger>
          <TabsTrigger
            value="ab-tests"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            A/B Tests
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search by name" className="pl-10 h-10 border-gray-300" />
          </div>

          <Button variant="outline" className="ml-4 flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Labels</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent At</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Delivered</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((notification) => (
                <TableRow key={notification.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="font-medium">{notification.name}</TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-md px-2 py-1 text-xs font-normal",
                        notification.status === "Draft" && "bg-gray-100 text-gray-700",
                        notification.status === "Delivered" && "bg-green-50 text-green-700",
                        notification.status === "Cancelled" && "bg-red-50 text-red-700",
                      )}
                    >
                      {notification.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.sentAt}</TableCell>
                  <TableCell>{notification.createdAt}</TableCell>
                  <TableCell>{notification.delivered}</TableCell>
                  <TableCell>{notification.ctr}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0"
            >
              ‹
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = i + 1
              return (
                <Button
                  key={i}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={cn("h-8 w-8 p-0", currentPage === pageNumber && "bg-indigo-600")}
                >
                  {pageNumber}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0"
            >
              ›
            </Button>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <div className="flex justify-center space-x-4">
          <a href="#" className="hover:text-gray-700">
            Homepage
          </a>
          <a href="#" className="hover:text-gray-700">
            Blog
          </a>
          <a href="#" className="hover:text-gray-700">
            Status Page
          </a>
          <a href="#" className="hover:text-gray-700">
            Twitter
          </a>
          <a href="#" className="hover:text-gray-700">
            Careers
          </a>
        </div>
      </footer>
    </div>
  )
}
