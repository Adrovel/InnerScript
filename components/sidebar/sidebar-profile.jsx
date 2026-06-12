"use client";

import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function SidebarProfile() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                type="button"
                size="lg"
                aria-label="Open profile menu"
                className="interactive-element h-11 rounded-lg bg-sidebar-accent/55 px-2 text-sidebar-foreground/82 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar size="sm">
              <AvatarFallback>
                U
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">Username</span>
            <MoreHorizontal
              data-icon="inline-end"
              className="text-sidebar-foreground/58"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            aria-label="Profile menu"
            className="min-h-7 w-32"
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
