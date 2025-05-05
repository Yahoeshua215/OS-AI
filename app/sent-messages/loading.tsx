import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 mx-1 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 mx-1 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="p-4">
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-5 w-[200px]" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-10" />
                  <Skeleton className="h-5 w-16" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
