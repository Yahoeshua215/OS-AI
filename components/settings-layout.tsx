"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { name: "Supabase", href: "/settings/supabase" },
    { name: "General", href: "/settings/general" },
    { name: "API Keys", href: "/settings/api" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              pathname === tab.href
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      {children}
    </div>
  )
}
