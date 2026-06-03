import { Skeleton } from "@/components/ui/skeleton";

export function JournalShellSkeleton() {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-background">
      <div className="hidden w-sidebar-width shrink-0 border-r border-surface-variant/20 bg-surface-container-low p-md md:block">
        <Skeleton className="mb-md h-10 w-10 rounded-full bg-surface-container-high" />
        <Skeleton className="mb-lg h-8 w-full rounded bg-surface-container-high" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-full rounded bg-surface-container-high" />
          <Skeleton className="h-8 w-full rounded bg-surface-container-high" />
          <Skeleton className="h-8 w-full rounded bg-surface-container-high" />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-end border-b border-surface-variant/20 px-xl">
          <Skeleton className="h-6 w-32 rounded-full bg-surface-container-high" />
        </div>
        <div className="mx-auto flex w-full max-w-[680px] flex-col gap-4 px-6 py-10 md:px-12">
          <Skeleton className="h-10 w-2/3 bg-surface-container-high" />
          <Skeleton className="h-4 w-40 bg-surface-container-high" />
          <Skeleton className="h-px w-full bg-surface-container-high" />
          <Skeleton className="h-6 w-full bg-surface-container-high" />
          <Skeleton className="h-6 w-5/6 bg-surface-container-high" />
          <Skeleton className="h-6 w-2/3 bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}
