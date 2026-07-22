import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const VERSIONS = [
  { id: "v1", href: "/onboard/v1", label: "Pattern background" },
  { id: "v2", href: "/onboard/v2", label: "Masked cards" },
];

function sideTargets(current) {
  const index = VERSIONS.findIndex((version) => version.id === current);
  const safeIndex = index < 0 ? 0 : index;
  const prev = VERSIONS[(safeIndex - 1 + VERSIONS.length) % VERSIONS.length];
  const next = VERSIONS[(safeIndex + 1) % VERSIONS.length];
  return { prev, next };
}

function NavArrow({ href, label, direction }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "fixed top-3 z-40 flex size-10 items-center justify-center rounded-full sm:top-1/2 sm:size-11 sm:-translate-y-1/2",
        "border border-white/55 bg-white/35 text-[#0B3154] shadow-[0_4px_14px_rgba(11,49,84,0.12)] backdrop-blur-md",
        "transition-[background,transform,box-shadow] duration-200",
        "hover:bg-white/55 hover:shadow-[0_6px_18px_rgba(11,49,84,0.16)] active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0088FF]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#C5E7FF]",
        direction === "prev" ? "left-3 sm:left-5" : "right-3 sm:right-5",
      )}
    >
      <Icon className="size-5" strokeWidth={2} aria-hidden />
    </Link>
  );
}

export function OnboardVersionNav({ current = "v1" }) {
  const { prev, next } = sideTargets(current);

  return (
    <div data-liquid-ignore>
      <NavArrow
        direction="prev"
        href={prev.href}
        label={`Switch to ${prev.label}`}
      />
      <NavArrow
        direction="next"
        href={next.href}
        label={`Switch to ${next.label}`}
      />
    </div>
  );
}
