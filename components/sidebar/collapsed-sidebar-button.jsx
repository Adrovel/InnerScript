"use client";

import { ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function CollapsedSidebarButton() {
  const { setOpen, state } = useSidebar();

  if (state !== "collapsed") {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label="Expand sidebar"
      onClick={() => setOpen(true)}
      className="interactive-element fixed left-4 top-4 z-50 hidden rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent hover:text-sidebar-primary md:inline-flex"
    >
      <ChevronsRight aria-hidden="true" />
    </Button>
  );
}
