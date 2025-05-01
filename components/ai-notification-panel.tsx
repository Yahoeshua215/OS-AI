"use client"
import { Button } from "@/components/ui/button"
import { AINotificationGenerator } from "@/components/ai-notification-generator"
import { useSupabase } from "@/lib/use-supabase"

interface AINotificationPanelProps {
  open: boolean
  onClose: () => void
  onSelectNotification: (notification: { title: string; body: string }) => void
}

export function AINotificationPanel({ open, onClose, onSelectNotification }: AINotificationPanelProps) {
  // Force Supabase to be considered as configured
  useSupabase(true)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="bg-black/20 absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-white shadow-lg flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Generate Push Notification with AI</h2>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AINotificationGenerator onSelectNotification={onSelectNotification} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
