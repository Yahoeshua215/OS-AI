"use client"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { AINotificationGenerator } from "@/components/ai-notification-generator"

interface AINotificationPanelProps {
  open: boolean
  onClose: () => void
  onSelectNotification: (notification: { title: string; subtitle: string; body: string }, variantId?: string) => void
  variants?: Array<{
    id: string
    title: string
    subtitle: string
    message: string
    image: string
    url: string
  }>
  activeVariant?: string
  onDeleteVariant?: (variantId: string) => void
}

export function AINotificationPanel({
  open,
  onClose,
  onSelectNotification,
  variants,
  activeVariant,
  onDeleteVariant,
}: AINotificationPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
        <div className="px-1 py-6">
          <h2 className="text-2xl font-bold mb-6">Smart Assist</h2>
          <AINotificationGenerator
            onSelectNotification={onSelectNotification}
            onClose={onClose}
            variants={variants}
            activeVariant={activeVariant}
            onDeleteVariant={onDeleteVariant}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
