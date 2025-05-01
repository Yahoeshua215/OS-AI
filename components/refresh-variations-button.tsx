"use client"

import type React from "react"

import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react"
import { Loader2, Sparkles, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RefreshVariationsButtonProps {
  content: string
  fieldType: "title" | "subtitle" | "message"
  onSelectVariation: (variation: string) => void
  onAdvancedOptions?: () => void
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
}

export type RefreshVariationsButtonRef = {
  openPopover: () => void
}

type Variation = {
  text: string
  tone: "Urgent" | "Friendly" | "Question" | string
}

export const RefreshVariationsButton = forwardRef<RefreshVariationsButtonRef, RefreshVariationsButtonProps>(
  function RefreshVariationsButton({ content, fieldType, onSelectVariation, onAdvancedOptions, inputRef }, ref) {
    const [isLoading, setIsLoading] = useState(false)
    const [variations, setVariations] = useState<Variation[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const popoverRef = useRef<HTMLDivElement>(null)

    // Expose the openPopover method to the parent component
    useImperativeHandle(ref, () => ({
      openPopover: () => {
        if (!isOpen) {
          setIsOpen(true)
          if (variations.length === 0) {
            fetchVariations()
          }
        }
      },
    }))

    // Reset variations when content changes
    useEffect(() => {
      setVariations([])
    }, [content])

    // Close popover when clicking outside
    useEffect(() => {
      if (!isOpen) return

      const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [isOpen])

    const fetchVariations = async () => {
      if (!content.trim()) {
        setVariations(generateFallbackVariations())
        return
      }

      setIsLoading(true)

      try {
        const response = await fetch("/api/generate-variations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
            fieldType,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        setVariations(data.variations || generateFallbackVariations())
      } catch (error) {
        console.error("Error fetching variations:", error)
        setVariations(generateFallbackVariations())
      } finally {
        setIsLoading(false)
      }
    }

    const generateFallbackVariations = (): Variation[] => {
      // Generate fallback variations based on the field type
      if (fieldType === "title") {
        return [
          { text: `Breaking News: Discover this title now!`, tone: "Urgent" },
          { text: `Hey there! Check out this amazing title`, tone: "Friendly" },
          { text: `What's Inside: Unveil the mystery of this title`, tone: "Question" },
        ]
      } else if (fieldType === "subtitle") {
        return [
          { text: `Limited time offer - Act now!`, tone: "Urgent" },
          { text: `We thought you might enjoy this`, tone: "Friendly" },
          { text: `Curious about what we have for you?`, tone: "Question" },
        ]
      } else {
        return [
          {
            text: `Don't miss out on this exclusive opportunity. Click now to learn more before it expires!`,
            tone: "Urgent",
          },
          {
            text: `We're excited to share this with you! We think you'll love what we've prepared just for you.`,
            tone: "Friendly",
          },
          {
            text: `Have you ever wondered what makes our product special? Discover the answer inside.`,
            tone: "Question",
          },
        ]
      }
    }

    const handleSelectVariation = (variation: Variation) => {
      onSelectVariation(variation.text)
      setIsOpen(false)
    }

    const handleAdvancedOptions = () => {
      setIsOpen(false)
      if (onAdvancedOptions) {
        onAdvancedOptions()
      }
    }

    const handleShuffle = async () => {
      setIsShuffling(true)
      await fetchVariations()
      setIsShuffling(false)
    }

    // Calculate position based on input element
    const getPopoverPosition = () => {
      if (!inputRef?.current) return { top: 0, left: 0 }

      const rect = inputRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + window.scrollY + 5,
        left: rect.right + window.scrollX - 500, // Align right edge with input right edge
      }
    }

    const position = getPopoverPosition()

    if (!isOpen) return null

    return (
      <div
        ref={popoverRef}
        className="fixed z-50 w-[500px] bg-white border border-gray-200 shadow-lg rounded-lg"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-base font-medium text-gray-900">Select a variation</h3>
        </div>

        <div className="py-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            variations.map((variation, index) => (
              <div
                key={index}
                className="border-b border-gray-100 last:border-b-0 px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                onClick={() => handleSelectVariation(variation)}
              >
                <span className="text-gray-900">{variation.text}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-2 px-3 py-1 rounded-full text-xs font-medium",
                    variation.tone === "Urgent" && "bg-gray-100 text-gray-700",
                    variation.tone === "Friendly" && "bg-gray-100 text-gray-700",
                    variation.tone === "Question" && "bg-gray-100 text-gray-700",
                  )}
                >
                  {variation.tone}
                </Badge>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-200 p-3 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center"
            onClick={handleShuffle}
            disabled={isShuffling}
          >
            {isShuffling ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shuffle className="h-4 w-4 mr-2" />}
            Shuffle
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center"
            onClick={handleAdvancedOptions}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Advanced assist
          </Button>
        </div>
      </div>
    )
  },
)
