import { Skeleton } from "@/components/ui/skeleton";

export function JournalEditorSkeleton() {
  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[840px] flex-1 flex-col px-6 py-12 md:px-10">
      <div className="mb-10 flex items-center gap-3">
        <Skeleton className="h-8 w-4 rounded-sm bg-surface-container-high/70" />
        <Skeleton className="h-9 w-56 rounded bg-surface-container-high/70" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-full rounded bg-surface-container-high/55" />
        <Skeleton className="h-5 w-11/12 rounded bg-surface-container-high/50" />
        <Skeleton className="h-5 w-4/5 rounded bg-surface-container-high/45" />
      </div>
      <div className="mt-auto flex justify-between pt-10">
        <Skeleton className="h-4 w-44 rounded bg-surface-container-high/40" />
        <Skeleton className="h-6 w-32 rounded-full bg-surface-container-high/45" />
      </div>
    </div>
  );
}

export function JournalShellSkeleton() {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-background">
      <div className="hidden w-sidebar-width shrink-0 border-r border-surface-variant/20 bg-surface-container-low px-sm py-md md:block">
        <div className="mb-md">
          <div className="mb-md flex items-center gap-sm px-1">
            <Skeleton className="h-9 w-9 rounded-full bg-surface-container-high/70" />
            <div className="min-w-0 flex-1">
              <Skeleton className="mb-1.5 h-4 w-24 rounded bg-surface-container-high/65" />
              <Skeleton className="h-3 w-14 rounded bg-surface-container-high/45" />
            </div>
            <Skeleton className="h-9 w-9 rounded-full bg-surface-container-high/45" />
          </div>
          <div className="mb-xs">
            <Skeleton className="h-9 flex-1 rounded-lg bg-surface-container-high/65" />
          </div>
          <Skeleton className="h-9 w-full rounded-lg bg-surface-container-high/45" />
        </div>
        <div className="border-t border-outline-variant/10 pt-sm">
          <div className="mb-1 flex h-9 items-center gap-2.5 px-3">
            <Skeleton className="h-4 w-4 rounded bg-surface-container-high/50" />
            <Skeleton className="h-4 w-20 rounded bg-surface-container-high/55" />
            <Skeleton className="ml-auto h-4 w-4 rounded bg-surface-container-high/40" />
          </div>
          <div className="mb-2 flex flex-col gap-1 pl-8">
            <Skeleton className="h-7 w-full rounded bg-surface-container-high/55" />
            <Skeleton className="h-7 w-5/6 rounded bg-surface-container-high/45" />
          </div>
          <div className="flex h-9 items-center gap-2.5 px-3">
            <Skeleton className="h-4 w-4 rounded bg-surface-container-high/50" />
            <Skeleton className="h-4 w-14 rounded bg-surface-container-high/55" />
            <Skeleton className="ml-auto h-4 w-4 rounded bg-surface-container-high/40" />
          </div>
          <div className="flex flex-col gap-1 pl-8">
            <Skeleton className="h-7 w-4/5 rounded bg-surface-container-high/45" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-end border-b border-surface-variant/20 px-xl">
          <Skeleton className="h-6 w-32 rounded-full bg-surface-container-high/55" />
        </div>
        <JournalEditorSkeleton />
      </div>
    </div>
  );
}
