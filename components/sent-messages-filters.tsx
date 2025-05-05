"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SentMessagesFilters() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-48">
        <Select defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Messages: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Messages: All</SelectItem>
            <SelectItem value="push">Push Notifications</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-48">
        <Select defaultValue="all-platforms">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-platforms">All Platforms</SelectItem>
            <SelectItem value="ios">iOS</SelectItem>
            <SelectItem value="android">Android</SelectItem>
            <SelectItem value="web">Web</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="link" className="text-[#4346ce]">
        More Filters
      </Button>
    </div>
  )
}
