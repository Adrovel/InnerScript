"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { sidebarActionRowClass } from "./sidebar-styles";

export function SidebarActionRow({
  Icon,
  children,
  active = false,
  trailing = null,
  className,
  iconClassName,
  ...props
}) {
  return (
    <SidebarMenuButton
      type="button"
      isActive={active}
      className={cn(
        sidebarActionRowClass,
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[0_0_0_1px_var(--sidebar-border)]"
          : "text-sidebar-foreground/76 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    >
      <Icon
        className={cn(active ? "text-sidebar-primary" : "text-sidebar-foreground/62", iconClassName)}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing ? (
        <span className="ml-auto flex shrink-0 items-center text-sidebar-foreground/60">
          {trailing}
        </span>
      ) : null}
    </SidebarMenuButton>
  );
}
