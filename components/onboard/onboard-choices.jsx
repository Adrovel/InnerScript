import { cn } from "@/lib/utils";
import { SpaceChoiceCard } from "./space-choice-card";

const DEFAULT_CHOICES = [
  {
    variant: "journal",
    title: "Journal",
    description: "Start your first entry — a private place for daily writing and reflection.",
    href: "/",
    actionLabel: "Start writing",
  },
  {
    variant: "events",
    title: "Events",
    description: "Capture your first moment, milestone, or experience as it happens.",
    href: "/",
    actionLabel: "Add an event",
  },
];

const MASKED_ART = {
  journal: {
    variant: "journal",
    src: "/onboard/mask-card-journal.png",
  },
  events: {
    variant: "events",
    src: "/onboard/mask-card-events.png",
  },
};

export function OnboardChoices({ masked = false }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-[760px] flex-col items-center justify-center sm:flex-row sm:items-stretch sm:gap-6",
        masked ? "gap-[clamp(0.75rem,2dvh,1.5rem)]" : "gap-3",
      )}
    >
      {DEFAULT_CHOICES.map((choice) => (
        <SpaceChoiceCard
          key={choice.variant}
          variant={choice.variant}
          title={choice.title}
          description={choice.description}
          href={choice.href}
          actionLabel={choice.actionLabel}
          art={masked ? MASKED_ART[choice.variant] : undefined}
          translucent={!masked}
          fitMobileViewport
        />
      ))}
    </div>
  );
}
