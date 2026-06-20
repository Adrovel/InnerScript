"use client";

import { ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function CollapsedSidebarButton({ className }) {
  const { setOpen, state, isMobile } = useSidebar();

  if (state !== "collapsed" || isMobile) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label="Expand sidebar"
      onClick={() => setOpen(true)}
      className={cn(
        "interactive-element hidden shrink-0 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-primary md:inline-flex",
        className,
      )}
    >
      <ChevronsRight aria-hidden="true" />
    </Button>
  );
}
