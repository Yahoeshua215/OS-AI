import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SentMessagesHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <Link href="/" className="hover:text-gray-700">
          Demo Paid Org
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/" className="hover:text-gray-700">
          ALL DEMO Testing
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Delivery</span>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sent Messages</h1>
        <Button className="bg-[#4346ce] hover:bg-[#3a3db3]">Export</Button>
      </div>
    </div>
  )
}
