"use client"
import { Plus, Code, Smile, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InputEnhancementDropdownProps {
  content: string
  fieldType: "title" | "subtitle" | "message"
  onSelectMessageAssist: () => void
  onInsertPersonalization?: () => void
  onInsertEmoji?: () => void
  className?: string
}

export function InputEnhancementDropdown({
  content,
  fieldType,
  onSelectMessageAssist,
  onInsertPersonalization = () => {},
  onInsertEmoji = () => {},
  className,
}: InputEnhancementDropdownProps) {
  const hasContent = content.trim().length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-slate-100", className)}
        >
          <Plus className="h-4 w-4 text-[#303293]" />
          <span className="sr-only">Enhancement options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onInsertPersonalization} className="flex items-center py-2 cursor-pointer">
          <Code className="mr-2 h-4 w-4" />
          <span>Personalization Tag</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onInsertEmoji} className="flex items-center py-2 cursor-pointer">
          <Smile className="mr-2 h-4 w-4" />
          <span>Emoji</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            if (hasContent) {
              onSelectMessageAssist()
            }
          }}
          disabled={!hasContent}
          className={cn("flex items-center py-2", hasContent ? "cursor-pointer" : "cursor-not-allowed opacity-50")}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Message Assist</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
