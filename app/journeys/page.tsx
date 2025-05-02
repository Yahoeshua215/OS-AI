"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileText, Mail, MoreVertical, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { NewJourneyPanel } from "@/components/new-journey-panel"

export default function JourneysPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [isNewJourneyPanelOpen, setIsNewJourneyPanelOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Demo Paid Org</span>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>ALL DEMO Testing</span>
            </div>
            <h1 className="text-2xl font-bold">Journeys</h1>
          </div>
          <Button className="bg-[#4954e6] hover:bg-[#3a43c9]" onClick={() => setIsNewJourneyPanelOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Journey
          </Button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-6">
            <ChevronRight className="h-5 w-5 text-[#4954e6]" />
            <span className="text-[#4954e6] font-medium ml-2">Quickstart your Journey</span>
          </div>

          <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="all"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#4954e6] data-[state=active]:text-[#4954e6] data-[state=active]:shadow-none px-4 py-2 h-10 bg-transparent"
              >
                All <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">212</span>
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#4954e6] data-[state=active]:text-[#4954e6] data-[state=active]:shadow-none px-4 py-2 h-10 bg-transparent"
              >
                Active <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">70</span>
              </TabsTrigger>
              <TabsTrigger
                value="draft"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#4954e6] data-[state=active]:text-[#4954e6] data-[state=active]:shadow-none px-4 py-2 h-10 bg-transparent"
              >
                Draft <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">97</span>
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#4954e6] data-[state=active]:text-[#4954e6] data-[state=active]:shadow-none px-4 py-2 h-10 bg-transparent"
              >
                Archived <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">44</span>
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#4954e6] data-[state=active]:text-[#4954e6] data-[state=active]:shadow-none px-4 py-2 h-10 bg-transparent"
              >
                Scheduled <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">1</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex justify-between mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search by name" className="pl-10 w-[400px] border-gray-300" />
            </div>
            <Button variant="outline" className="border-gray-300">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <path
                  d="M7 9V9C7 8.44772 7.44772 8 8 8H8C8.55228 8 9 8.44772 9 9V9C9 9.55228 8.55228 10 8 10H8C7.44772 10 7 9.55228 7 9Z"
                  fill="currentColor"
                />
                <path
                  d="M7 15V15C7 14.4477 7.44772 14 8 14H8C8.55228 14 9 14.4477 9 15V15C9 15.5523 8.55228 16 8 16H8C7.44772 16 7 15.5523 7 15Z"
                  fill="currentColor"
                />
                <path d="M11 9H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M11 15H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="font-medium">
                    Name <ChevronDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead className="font-medium">
                    Status <ChevronDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead className="font-medium">Message Type</TableHead>
                  <TableHead className="font-medium">Started</TableHead>
                  <TableHead className="font-medium">Completed</TableHead>
                  <TableHead className="font-medium">
                    Created At <ChevronDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead className="font-medium">
                    Went Live <ChevronDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead className="font-medium">
                    Updated <ChevronDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead className="font-medium">
                    Archived <ChevronDown className="h-4 w-4 inline-block ml-1" />
                  </TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <JourneyRow
                  name="Lee Event"
                  status="Active"
                  messageTypes={["document"]}
                  started="2"
                  completed="0"
                  createdAt="3 hours ago"
                  wentLive="3 hours ago"
                  updated="3 hours ago"
                  archived="-"
                />
                <JourneyRow
                  name="Onboarding"
                  status="Draft"
                  messageTypes={["document", "mail", "calendar"]}
                  started="-"
                  completed="-"
                  createdAt="19 hours ago"
                  wentLive="-"
                  updated="19 hours ago"
                  archived="-"
                />
                <JourneyRow
                  name="New Journey 2025-05-01"
                  status="Active"
                  messageTypes={["mail"]}
                  started="0"
                  completed="0"
                  createdAt="21 hours ago"
                  wentLive="21 hours ago"
                  updated="21 hours ago"
                  archived="-"
                />
                <JourneyRow
                  name="eric m exclude segment test"
                  status="Active"
                  messageTypes={["document"]}
                  started="0"
                  completed="0"
                  createdAt="a day ago"
                  wentLive="a day ago"
                  updated="a day ago"
                  archived="-"
                />
                <JourneyRow
                  name="eric m iam dup test 28apr25 2"
                  status="Draft"
                  messageTypes={["document"]}
                  started="-"
                  completed="-"
                  createdAt="3 days ago"
                  wentLive="-"
                  updated="3 days ago"
                  archived="-"
                />
                <JourneyRow
                  name="eric m iam dup test 28apr25"
                  status="Draft"
                  messageTypes={["document"]}
                  started="-"
                  completed="-"
                  createdAt="3 days ago"
                  wentLive="-"
                  updated="3 days ago"
                  archived="-"
                />
                <JourneyRow
                  name="Michelle test Journey"
                  status="Archived"
                  messageTypes={["document", "mail"]}
                  started="275"
                  completed="275"
                  createdAt="3 days ago"
                  wentLive="3 days ago"
                  updated="3 days ago"
                  archived="3 days ago"
                />
                <JourneyRow
                  name="New Journey 2025-04-25"
                  status="Active"
                  messageTypes={["mail"]}
                  started="1"
                  completed="1"
                  createdAt="7 days ago"
                  wentLive="7 days ago"
                  updated="7 days ago"
                  archived="-"
                />
                <JourneyRow
                  name="Michelle test Journey for EA"
                  status="Archived"
                  messageTypes={["document"]}
                  started="2"
                  completed="2"
                  createdAt="7 days ago"
                  wentLive="7 days ago"
                  updated="7 days ago"
                  archived="7 days ago"
                />
                <JourneyRow
                  name="kerry test"
                  status="Draft"
                  messageTypes={["document"]}
                  started="-"
                  completed="-"
                  createdAt="7 days ago"
                  wentLive="-"
                  updated="4 days ago"
                  archived="-"
                />
                <JourneyRow
                  name="kerry test journey"
                  status="Archived"
                  messageTypes={["mail"]}
                  started="14,449"
                  completed="14,449"
                  createdAt="8 days ago"
                  wentLive="8 days ago"
                  updated="8 days ago"
                  archived="8 days ago"
                />
                <JourneyRow
                  name="WorldReader Re-engagement"
                  status="Active"
                  messageTypes={["document", "mail", "globe"]}
                  started="18,292"
                  completed="18,259"
                  createdAt="10 days ago"
                  wentLive="8 days ago"
                  updated="8 days ago"
                  archived="-"
                />
                <JourneyRow
                  name="New Journey 2025-04-22"
                  status="Active"
                  messageTypes={["document"]}
                  started="56"
                  completed="56"
                  createdAt="10 days ago"
                  wentLive="10 days ago"
                  updated="10 days ago"
                  archived="-"
                />
                <JourneyRow
                  name="New Journey 2025-04-21"
                  status="Draft"
                  messageTypes={["document"]}
                  started="-"
                  completed="-"
                  createdAt="11 days ago"
                  wentLive="-"
                  updated="11 days ago"
                  archived="-"
                />
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <NewJourneyPanel open={isNewJourneyPanelOpen} onOpenChange={setIsNewJourneyPanelOpen} />
    </>
  )
}

interface JourneyRowProps {
  name: string
  status: "Active" | "Draft" | "Archived"
  messageTypes: ("document" | "mail" | "calendar" | "globe")[]
  started: string
  completed: string
  createdAt: string
  wentLive: string
  updated: string
  archived: string
}

function JourneyRow({
  name,
  status,
  messageTypes,
  started,
  completed,
  createdAt,
  wentLive,
  updated,
  archived,
}: JourneyRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox />
      </TableCell>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 rounded text-xs ${
            status === "Active"
              ? "bg-green-100 text-green-800"
              : status === "Draft"
                ? "bg-gray-100 text-gray-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          {messageTypes.map((type, index) => (
            <div key={index}>
              {type === "document" && <FileText className="h-4 w-4" />}
              {type === "mail" && <Mail className="h-4 w-4" />}
              {type === "calendar" && (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
              {type === "globe" && (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 2C14.6522 2 17.1957 3.05357 19.0711 4.92893C20.9464 6.8043 22 9.34784 22 12C22 14.6522 20.9464 17.1957 19.0711 19.0711C17.1957 20.9464 14.6522 22 12 22"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 2V22" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell>{started}</TableCell>
      <TableCell>{completed}</TableCell>
      <TableCell>{createdAt}</TableCell>
      <TableCell>{wentLive}</TableCell>
      <TableCell>{updated}</TableCell>
      <TableCell>{archived}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
