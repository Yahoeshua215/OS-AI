"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PushNotificationsContent } from "@/components/push-notifications-content"
import { Sidebar } from "@/components/sidebar"
import { NewMessageSidePanel } from "@/components/new-message-dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PushPage() {
  const router = useRouter()
  const [newMessageOpen, setNewMessageOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Org Name</span>
            <span className="mx-2">›</span>
            <span>App Name</span>
            <span className="mx-2">›</span>
            <Link href="/messages" className="hover:text-gray-700">
              Messages
            </Link>
            <span className="mx-2">›</span>
            <Link href="/push" className="hover:text-gray-700">
              Push
            </Link>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Push Notifications</h1>
            <div className="flex space-x-3">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setNewMessageOpen(true)}>
                New Message ▼
              </Button>
            </div>
          </div>

          <PushNotificationsContent />
        </main>
        <NewMessageSidePanel open={newMessageOpen} onClose={() => setNewMessageOpen(false)} />
      </div>
    </div>
  )
}
