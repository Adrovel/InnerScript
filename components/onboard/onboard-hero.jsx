import { cn } from "@/lib/utils";

export function OnboardHero({
  eyebrow = "Welcome to InnerScript",
  title = "Where would you like to begin?",
  subtitle = "Pick a space to start. You can always explore the other later.",
  uniformFont = false,
  className,
}) {
  return (
    <header className={cn("flex w-full max-w-[760px] flex-col items-center gap-3 text-center", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-sm font-medium leading-[1.4] text-[#2B6288]",
            uniformFont ? null : "font-sans",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "text-[clamp(1.75rem,4vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[#0B3154]",
          uniformFont ? null : "font-serif",
        )}
      >
        {title}
      </h1>
      <p
        className={cn(
          "text-base font-normal leading-[1.5] text-[#356782]",
          uniformFont ? null : "font-sans",
        )}
      >
        {subtitle}
      </p>
    </header>
  );
}
