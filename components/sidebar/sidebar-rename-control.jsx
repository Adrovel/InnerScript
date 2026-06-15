"use client";

import { useEffect, useRef, useState } from "react";
import { SidebarMenuButton, SidebarMenuSubButton } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { sidebarEntryRowClass } from "./sidebar-styles";

export function SidebarRenameControl({
  initialName,
  Icon,
  nested = false,
  selected = false,
  saving = false,
  className,
  onRename,
  onCancel,
}) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const cancellingRef = useRef(false);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const commitRename = async () => {
    if (saving || cancellingRef.current) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName || trimmedName === initialName) {
      onCancel?.();
      return;
    }

    setError(null);

    try {
      await onRename?.(trimmedName);
    } catch {
      setError("Could not rename");
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
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

  return (
    <Control
      render={<label />}
      isActive={selected}
      aria-busy={saving}
      className={cn(
        sidebarEntryRowClass,
        "cursor-text bg-sidebar-accent/35 text-sidebar-foreground/76 focus-within:bg-sidebar-accent focus-within:text-sidebar-accent-foreground focus-within:shadow-[0_0_0_1px_var(--sidebar-border)]",
        selected
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--sidebar-primary),0_0_0_1px_var(--sidebar-border)]"
          : null,
        className,
      )}
    >
      {Icon ? <Icon className="text-sidebar-foreground/62" aria-hidden="true" /> : null}
      <input
        ref={inputRef}
        type="text"
        value={name}
        disabled={saving}
        onChange={(event) => setName(event.target.value)}
        onBlur={() => {
          void commitRename();
        }}
        onKeyDown={handleKeyDown}
        aria-label="Rename"
        aria-invalid={Boolean(error)}
        className="min-w-0 flex-1 bg-transparent p-0 text-[13px] font-medium text-sidebar-foreground outline-none placeholder:text-sidebar-foreground/60 disabled:cursor-wait"
      />
    </Control>
  );
}
