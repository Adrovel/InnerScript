"use client";

import { ChevronsLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarBrand() {
  const { isMobile, setOpen, setOpenMobile } = useSidebar();

  const collapseSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
      return;
    }

    setOpen(false);
  };

  return (
    <div className="flex h-10 items-center gap-2 -mr-1">
      <h3 className="min-w-0 flex-1 truncate text-lg font-semibold text-sidebar-foreground">
        Innerscript
      </h3>
      <Button
        type="button"
        variant="ghost"
        size="icon-lg"
        aria-label="Collapse sidebar"
        title="Collapse sidebar"
        onClick={collapseSidebar}
        className="interactive-element rounded-full text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-primary hover:shadow-[0_0_0_1px_var(--sidebar-border)]"
      >
        <ChevronsLeft data-icon="inline-start" aria-hidden="true" />
      </Button>
    </div>
  );
}
