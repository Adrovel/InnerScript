"use client";

import { Search } from "lucide-react";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { sidebarActionRowClass } from "./sidebar-styles";

export function SidebarSearch({ query, onQueryChange }) {
  return (
    <SidebarMenuButton
      render={<label />}
      isActive={query.trim().length > 0}
      className={cn(
        sidebarActionRowClass,
        "cursor-text bg-sidebar-accent/35 text-sidebar-foreground/76 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground focus-within:bg-sidebar-accent focus-within:text-sidebar-accent-foreground focus-within:shadow-[0_0_0_1px_var(--sidebar-border)]",
      )}
    >
      <Search className="text-sidebar-foreground/62" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        aria-label="Search entries"
        placeholder="Search"
        className="min-w-0 flex-1 bg-transparent p-0 text-sm font-medium text-sidebar-foreground outline-none placeholder:text-sidebar-foreground/60"
      />
    </SidebarMenuButton>
  );
}
