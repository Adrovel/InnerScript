"use client";

import { useEffect, useRef, useState } from "react";
import { FolderPlus } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { sidebarEntryRowClass } from "./sidebar-styles";

export function SidebarFolderDraftRow({
  parentFolderId = null,
  nested = false,
  onCreateFolder,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const cancellingRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commitFolder = async () => {
    if (saving || cancellingRef.current) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      onCancel?.();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onCreateFolder?.({
        name: trimmedName,
        parentFolderId,
      });
    } catch {
      setError("Could not save folder");
      setSaving(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancellingRef.current = true;
      onCancel?.();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }
  };

  const Control = nested ? SidebarMenuSubButton : SidebarMenuButton;
  const Item = nested ? SidebarMenuSubItem : SidebarMenuItem;

  return (
    <Item>
      <Control
        render={<label />}
        aria-busy={saving}
        className={cn(
          sidebarEntryRowClass,
          "cursor-text bg-sidebar-accent/35 text-sidebar-foreground/76 focus-within:bg-sidebar-accent focus-within:text-sidebar-accent-foreground focus-within:shadow-[0_0_0_1px_var(--sidebar-border)]",
          nested ? "-translate-x-px" : null,
        )}
      >
        <FolderPlus className="text-sidebar-foreground/62" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={name}
          disabled={saving}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => {
            void commitFolder();
          }}
          onKeyDown={handleKeyDown}
          aria-label="Folder name"
          aria-invalid={Boolean(error)}
          placeholder={saving ? "Saving..." : "Folder name"}
          className="min-w-0 flex-1 bg-transparent p-0 text-[13px] font-medium text-sidebar-foreground outline-none placeholder:text-sidebar-foreground/60 disabled:cursor-wait"
        />
      </Control>
    </Item>
  );
}
