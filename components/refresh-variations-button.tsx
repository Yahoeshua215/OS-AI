"use client"

import { useState } from "react"
import { RefreshCw, Loader2, Sparkles, Shuffle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RefreshVariationsButtonProps {
  content: string
  fieldType: "title" | "subtitle" | "message"
  onSelectVariation: (variation: string) => void
}

type Variation = {
  text: string
  qualifier: string
}

export function RefreshVariationsButton({ content, fieldType, onSelectVariation }: RefreshVariationsButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [variations, setVariations] = useState<Variation[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const fetchVariations = async () => {
    if (!content.trim()) return

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
      return data.variations
    } catch (error) {
      console.error("Error fetching variations:", error)
      // Fallback variations
      return [
        { text: content, qualifier: "Original" },
        { text: `${content} (alternative)`, qualifier: "Alternative" },
        { text: `${content} (reworded)`, qualifier: "Reworded" },
      ]
    } finally {
      setIsLoading(false)
    }
  }

  const generateVariations = async () => {
    if (!content.trim()) return

    setIsOpen(true)

    if (variations.length === 0) {
      const newVariations = await fetchVariations()
      setVariations(newVariations)
    }
  }

  const handleSelectVariation = (variation: Variation) => {
    onSelectVariation(variation.text)
    setIsOpen(false)
  }

  const handleAdvancedAssist = () => {
    setIsOpen(false)
    // Here you would implement the advanced assist functionality
    console.log("Advanced assist clicked")
  }

  const handleShuffle = async () => {
    setIsShuffling(true)

    try {
      const newVariations = await fetchVariations()
      setVariations(newVariations)
    } catch (error) {
      console.error("Error shuffling variations:", error)
    } finally {
      setIsShuffling(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={generateVariations}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label={`Generate variations for ${fieldType}`}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 min-w-[350px] w-auto bg-gray-50 text-gray-900 border-gray-200 shadow-md"
        align="end"
        alignOffset={0}
        sideOffset={5}
        avoidCollisions={false}
      >
        <div className="py-2">
          <div className="px-3 py-2 text-sm font-medium border-b border-gray-200 bg-white">Select a variation</div>
          <div className="mt-1">
            {variations.map((variation, index) => (
              <div key={index} className={cn("border-b border-gray-200 last:border-b-0")}>
                <Button
                  variant="ghost"
                  className="w-full justify-between rounded-none px-3 py-3 text-sm font-normal text-gray-800 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => handleSelectVariation(variation)}
                >
                  <span className="text-left truncate mr-2">{variation.text}</span>
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-600 border-gray-200 text-[10px] py-0 px-1.5 ml-auto flex-shrink-0"
                  >
                    {variation.qualifier}
                  </Badge>
                </Button>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center items-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          <div className="px-3 pt-2 pb-1 border-t border-gray-200 flex gap-2 bg-white">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white hover:bg-gray-100 text-gray-700 border-gray-200"
              onClick={handleShuffle}
              disabled={isShuffling}
            >
              {isShuffling ? (
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
              ) : (
                <Shuffle className="h-3.5 w-3.5 mr-2" />
              )}
              Shuffle
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white hover:bg-gray-100 text-gray-700 border-gray-200"
              onClick={handleAdvancedAssist}
            >
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Advanced assist
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
