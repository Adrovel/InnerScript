"use client";

export function SidebarMessage({ type }) {
  const message = type === "no-results" ? "No matching entries." : "No entries yet. Start with one honest page.";

  return (
    <p className="px-2 py-sm text-[13px] leading-5 text-sidebar-foreground/62">
      {message}
    </p>
  );
}
