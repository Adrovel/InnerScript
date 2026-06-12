"use client";

export function SidebarMessage({ type }) {
  const message = type === "no-results" ? "No matching entries." : null;

  if (!message) {
    return null;
  }

  return (
    <p className="px-2 py-sm text-[13px] leading-5 text-sidebar-foreground/62">
      {message}
    </p>
  );
}
