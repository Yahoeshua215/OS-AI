"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Smartphone, Mail, MoreVertical } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"

// Mock data for sent messages
const messages = [
  {
    id: 1,
    type: "chat",
    name: "Lee",
    status: "Delivered",
    sentAt: "05/04/25, 1:15:15 am",
    sent: 1,
    ctr: "N/A",
    createdBy: "/diverse-group.png",
  },
  {
    id: 2,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 1:21:02 pm",
    sent: 1,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 3,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 1:20:54 pm",
    sent: 1,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 4,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 1:19:58 pm",
    sent: 1,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 5,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "Delivered",
    sentAt: "05/02/25, 11:23:56 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 6,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "No Recipients",
    sentAt: "05/02/25, 11:21:28 am",
    sent: 0,
    ctr: "N/A",
    createdBy: "/diverse-group.png",
  },
  {
    id: 7,
    type: "push",
    name: "Internal OneSignal Notification Name 1",
    status: "No Recipients",
    sentAt: "05/02/25, 11:19:51 am",
    sent: 0,
    ctr: "N/A",
    createdBy: "/diverse-group.png",
  },
  {
    id: 8,
    type: "email",
    name: "Test message from catherine",
    status: "Delivered",
    sentAt: "05/02/25, 10:51:21 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 9,
    type: "email",
    name: "Test from Jenny.",
    status: "Delivered",
    sentAt: "05/02/25, 10:50:33 am",
    sent: 4,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 10,
    type: "email",
    name: "Hello from Olive",
    status: "Delivered",
    sentAt: "05/02/25, 10:50:19 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 11,
    type: "email",
    name: "Charles Postman Test",
    status: "Delivered",
    sentAt: "05/02/25, 10:49:55 am",
    sent: 6,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
  {
    id: 12,
    type: "email",
    name: "Hello from Olive",
    status: "Delivered",
    sentAt: "05/02/25, 10:49:44 am",
    sent: 1,
    ctr: "0.00%",
    createdBy: "/diverse-group.png",
  },
]

export function SentMessagesTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead className="text-right">Sent</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className="hover:bg-gray-50">
              <TableCell>
                {message.type === "push" && <Smartphone className="h-5 w-5 text-gray-700" />}
                {message.type === "email" && <Mail className="h-5 w-5 text-gray-700" />}
                {message.type === "chat" && <MessageSquare className="h-5 w-5 text-gray-700" />}
              </TableCell>
              <TableCell className="font-medium">{message.name}</TableCell>
              <TableCell>
                {message.status === "Delivered" ? (
                  <Badge className="bg-[#e7f6ee] text-[#2e905b] hover:bg-[#e7f6ee] hover:text-[#2e905b]">
                    Delivered
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800">
                    No Recipients
                  </Badge>
                )}
              </TableCell>
              <TableCell>{message.sentAt}</TableCell>
              <TableCell className="text-right">{message.sent}</TableCell>
              <TableCell>{message.ctr}</TableCell>
              <TableCell>
                <Avatar className="h-8 w-8">
                  <img src={message.createdBy || "/placeholder.svg"} alt="User avatar" />
                </Avatar>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
