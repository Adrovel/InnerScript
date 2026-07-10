"use client";

import { SaveStatus } from "@/components/journal/save-status";
import { CollapsedSidebarButton } from "@/components/sidebar/collapsed-sidebar-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Download, FileDown, Menu } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";

export function TopAppBar({
  breadcrumbItems = [],
  saveStatus,
  saveActivityId,
  onRetrySave,
  onExportMarkdown,
  onExportAllMarkdown,
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-surface-variant/20 bg-surface">
      <nav
        aria-label="Journal workspace"
        className="flex h-full w-full items-center justify-between gap-md px-md md:px-xl"
      >
        <div className="flex min-w-0 flex-1 items-center gap-sm">
          <button
            type="button"
            aria-label="Menu"
            onClick={onMenuClick}
            className="interactive-element rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary md:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>

          <CollapsedSidebarButton />

          <EditorBreadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex shrink-0 items-center gap-sm">
          <div className="hidden items-center gap-1 text-xs text-on-surface-variant md:flex">
            <Link className="rounded-full px-2 py-1 hover:bg-surface-container-high hover:text-primary" href="/search">Search</Link>
            <Link className="rounded-full px-2 py-1 hover:bg-surface-container-high hover:text-primary" href="/imports">Imports</Link>
            <Link className="rounded-full px-2 py-1 hover:bg-surface-container-high hover:text-primary" href="/people">People</Link>
            <Link className="rounded-full px-2 py-1 hover:bg-surface-container-high hover:text-primary" href="/insights">Insights</Link>
            <Link className="rounded-full px-2 py-1 hover:bg-surface-container-high hover:text-primary" href="/settings/privacy">Privacy</Link>
          </div>

          <button
            type="button"
            aria-label="Export current entry as Markdown"
            title="Export current entry"
            onClick={onExportMarkdown}
            className="interactive-element rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
          >
            <Download className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Export all entries as Markdown"
            title="Export all entries"
            onClick={onExportAllMarkdown}
            className="interactive-element rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-primary"
          >
            <FileDown className="size-5" aria-hidden="true" />
          </button>

          <SaveStatus
            status={saveStatus}
            activityId={saveActivityId}
            onRetry={onRetrySave}
          />
        </div>
      </nav>
    </header>
  );
}

function EditorBreadcrumb({ items }) {
  if (items.length === 0) {
    return null;
  }

  const currentItem = items[items.length - 1];

  return (
    <div className="min-w-0 flex-1">
      <Breadcrumb className="min-w-0 sm:hidden">
        <BreadcrumbList className="min-w-0 flex-nowrap text-xs">
          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="block truncate">
              {currentItem.label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Breadcrumb className="hidden min-w-0 sm:block">
        <BreadcrumbList className="min-w-0 flex-nowrap text-xs md:text-sm">
          {items.map((item, index) => {
            const isCurrent = index === items.length - 1;

            return (
              <Fragment key={`${item.label}-${index}`}>
                {index > 0 ? <BreadcrumbSeparator className="shrink-0" /> : null}
                <BreadcrumbItem className={isCurrent ? "min-w-0 flex-1" : "shrink-0"}>
                  {isCurrent ? (
                    <BreadcrumbPage className="block truncate">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <span className="block max-w-36 truncate">{item.label}</span>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
