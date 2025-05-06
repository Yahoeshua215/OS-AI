"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Grid,
  LifeBuoy,
  Mail,
  MessageSquare,
  Package,
  Smartphone,
  Users,
  BarChart,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    messages: true,
    audience: false,
    delivery: false,
  })

  // Automatically open the messages menu if we're on a messages-related page
  useEffect(() => {
    if (
      pathname?.includes("/push") ||
      pathname?.includes("/in-app") ||
      pathname?.includes("/email") ||
      pathname?.includes("/sms")
    ) {
      setOpenMenus((prev) => ({ ...prev, messages: true }))
    }

    if (
      pathname?.includes("/audience") ||
      pathname?.includes("/segments") ||
      pathname?.includes("/users") ||
      pathname?.includes("/subscriptions")
    ) {
      setOpenMenus((prev) => ({ ...prev, audience: true }))
    }
  }, [pathname])

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // Check if the current path is a push-related path or if we're on the home page
  // This makes the Push menu item active by default on the home page
  const isPushPath = pathname === "/" || pathname === "/push" || pathname?.startsWith("/push/")
  const isSegmentsPath = pathname === "/segments" || pathname?.startsWith("/segments/")
  const isUsersPath = pathname === "/audience/users" || pathname?.startsWith("/audience/users/")
  const isSubscriptionsPath = pathname === "/audience/subscriptions" || pathname?.startsWith("/audience/subscriptions/")

  return (
    <div className="w-[230px] bg-[#0a0a2e] text-white flex flex-col h-full">
      <div className="w-full px-6 py-4">
        <div className="relative w-full aspect-[3/1]">
          <Image src="/onesignal-logo.svg" alt="OneSignal Logo" fill className="object-contain" priority />
        </div>
      </div>

      <div className="px-4 py-2">
        <Button variant="outline" className="w-full bg-transparent border-gray-600 text-white justify-between">
          <span>Demo App</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2 py-4">
          {/* Dashboard is never active - using a custom class to override the active state */}
          <Link href="/" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-white/10">
            <Grid className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
          </Link>

          <div className="py-1">
            <button
              onClick={() => toggleMenu("messages")}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10",
                isPushPath && "bg-[#3a3a87] text-white",
              )}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              <span>Messages</span>
              {openMenus.messages ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>

            {openMenus.messages && (
              <div className="ml-8 mt-1 space-y-1">
                <NavItem href="/push" label="Push" isSubItem isActive={isPushPath} />
                <NavItem href="/in-app" label="In-App" isSubItem />
                <NavItem href="/email" label="Email" isSubItem />
                <NavItem href="/sms" label="SMS" isSubItem />
                <NavItem href="/templates" label="Templates" isSubItem />
                <NavItem href="/automated" label="Automated" isSubItem />
              </div>
            )}
          </div>

          <NavItem
            href="/journeys"
            icon={<Package className="h-5 w-5" />}
            label="Journeys"
            isActive={pathname === "/journeys" || pathname?.startsWith("/journeys/")}
          />

          <div className="py-1">
            <button
              onClick={() => toggleMenu("audience")}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10",
                (isSegmentsPath || isUsersPath || isSubscriptionsPath || pathname === "/audience") &&
                  "bg-[#3a3a87] text-white",
              )}
            >
              <Users className="h-5 w-5 mr-3" />
              <span>Audience</span>
              {openMenus.audience ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>

            {openMenus.audience && (
              <div className="ml-8 mt-1 space-y-1">
                <NavItem href="/segments" label="Segments" isSubItem isActive={isSegmentsPath} />
                <NavItem href="/audience/users" label="Users" isSubItem isActive={isUsersPath} />
                <NavItem
                  href="/audience/subscriptions"
                  label="Subscriptions"
                  isSubItem
                  isActive={isSubscriptionsPath}
                />
              </div>
            )}
          </div>

          <div className="py-1">
            <button
              onClick={() => toggleMenu("delivery")}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10",
                pathname?.startsWith("/sent-messages") && "bg-[#3a3a87] text-white",
              )}
            >
              <Smartphone className="h-5 w-5 mr-3" />
              <span>Delivery</span>
              {openMenus.delivery ? (
                <ChevronUp className="h-4 w-4 ml-auto" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-auto" />
              )}
            </button>

            {openMenus.delivery && (
              <div className="ml-8 mt-1 space-y-1">
                <NavItem
                  href="/sent-messages"
                  label="Sent Messages"
                  isSubItem
                  isActive={pathname === "/sent-messages"}
                />
                <NavItem
                  href="/scheduled-messages"
                  label="Scheduled Messages"
                  isSubItem
                  isActive={pathname === "/scheduled-messages"}
                />
              </div>
            )}
          </div>

          <NavItem href="/analytics" icon={<BarChart className="h-5 w-5" />} label="Analytics" />

          {/* New OneSignal Intelligence navigation item */}
          {/*
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-intelligence"))}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-white/10"
          >
            <Sparkles className="h-5 w-5 mr-3 text-yellow-300" />
            <span>OneSignal Intelligence</span>
          </button>
          */}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <Button
          variant="outline"
          className="w-full bg-[#1a9f85] border-[#1a9f85] text-white hover:bg-[#158a73] hover:border-[#158a73]"
        >
          <span>Upgrade</span>
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="p-2">
        <NavItem href="/documentation" icon={<Mail className="h-5 w-5" />} label="Documentation" />
        <NavItem href="/support" icon={<LifeBuoy className="h-5 w-5" />} label="Support" />
      </div>

      <div className="p-4 flex items-center border-t border-gray-700">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-intelligence"))}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center mr-2 hover:bg-gray-200 transition-colors"
        >
          <Sparkles className="h-5 w-5 text-[#0a0a2e]" />
        </button>
        <ExternalLink className="h-5 w-5 ml-auto" />
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon?: React.ReactNode
  label: string
  isSubItem?: boolean
  isActive?: boolean
}

function NavItem({ href, icon, label, isSubItem = false, isActive = false }: NavItemProps) {
  const pathname = usePathname()
  const active = isActive || pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md hover:bg-white/10",
        active && "bg-[#3a3a87] text-white",
        isSubItem && "py-1",
      )}
    >
      {icon && <span className="mr-3">{icon}</span>}
      <span>{label}</span>
    </Link>
  )
}
