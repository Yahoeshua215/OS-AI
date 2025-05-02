import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="p-4">
        <Skeleton className="h-6 w-48 mb-6" />

        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>

        <div className="flex justify-between mb-4">
          <Skeleton className="h-10 w-[400px]" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="border rounded-md">
          <Skeleton className="h-12 w-full" />
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}
