"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="py-2 px-4 border-b border-gray-200">
      <div className="flex items-center justify-end text-sm text-gray-500">
        <Button variant="ghost" size="icon" className="mr-2">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
