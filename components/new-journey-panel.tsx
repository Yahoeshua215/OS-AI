"use client"

import { X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface NewJourneyPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewJourneyPanel({ open, onOpenChange }: NewJourneyPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-[800px] w-[800px] p-0 border-l" style={{ maxWidth: "800px", width: "800px" }}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Choose a Journey to start</h2>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Start from scratch card */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Start from scratch</h3>
                <p className="text-gray-700 mb-8">Build your own Journey from the ground up.</p>
                <div className="flex justify-end">
                  <Button className="bg-white text-[#4954e6] border border-[#4954e6] hover:bg-gray-50">Select</Button>
                </div>
              </div>

              {/* Onboarding card */}
              <div className="border rounded-lg p-6">
                <div className="flex justify-between mb-3">
                  <h3 className="text-xl font-bold">Onboarding</h3>
                  <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16 16L19 19M18 12H22M16 8L19 5M12 6V2M8 8L5 5M6 12H2M8 16L5 19M12 18V22M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
                        stroke="#6366F1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 mb-8">
                  Educate your users on how to maximize their value from your product.
                </p>
                <div className="flex justify-between">
                  <Button variant="ghost" className="text-[#4954e6] hover:bg-gray-50 px-0">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button className="bg-white text-[#4954e6] border border-[#4954e6] hover:bg-gray-50">Select</Button>
                </div>
              </div>

              {/* Promotional card */}
              <div className="border rounded-lg p-6">
                <div className="flex justify-between mb-3">
                  <h3 className="text-xl font-bold">Promotional</h3>
                  <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 8L14 12M14 12L18 16M14 12H22M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796"
                        stroke="#6366F1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 mb-8">Announce and send follow-up reminders for sales.</p>
                <div className="flex justify-between">
                  <Button variant="ghost" className="text-[#4954e6] hover:bg-gray-50 px-0">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button className="bg-white text-[#4954e6] border border-[#4954e6] hover:bg-gray-50">Select</Button>
                </div>
              </div>

              {/* Re-engagement card */}
              <div className="border rounded-lg p-6">
                <div className="flex justify-between mb-3">
                  <h3 className="text-xl font-bold">Re-engagement</h3>
                  <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19 8L15 12M15 12L19 16M15 12H22M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C13.6569 17 15.1372 16.1957 16 15"
                        stroke="#6366F1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 4.20404C13.7252 3.43827 12.2452 3 10.6667 3C5.8802 3 2 7.02944 2 12C2 16.9706 5.8802 21 10.6667 21C12.2452 21 13.7252 20.5617 15 19.796"
                        stroke="#6366F1"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 mb-8">
                  Communicate different value props and incentives to get your users back.
                </p>
                <div className="flex justify-between">
                  <Button variant="ghost" className="text-[#4954e6] hover:bg-gray-50 px-0">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button className="bg-white text-[#4954e6] border border-[#4954e6] hover:bg-gray-50">Select</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t p-6">
            <div className="flex justify-end">
              <Button className="bg-[#4954e6] hover:bg-[#3a43c9]" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
