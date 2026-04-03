import { Skeleton } from '@/components/ui/skeleton';

export default function EditorLoading() {
  return (
    <div className="flex h-screen flex-col">
      {/* Top bar skeleton */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar skeleton */}
        <div className="w-64 border-r p-4 space-y-3">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>

        {/* Main canvas skeleton */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-8">
          <Skeleton className="w-full max-w-4xl aspect-video rounded-lg" />
        </div>

        {/* Right sidebar skeleton */}
        <div className="w-72 border-l p-4 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full rounded-md" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-48 w-full rounded-md" />
        </div>
      </div>

      {/* Bottom bar skeleton */}
      <div className="flex h-10 items-center justify-between border-t px-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}
