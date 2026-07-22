import { OnboardHero } from "./onboard-hero";

export function OnboardFrame({ children, centerPrimary = false }) {
  if (centerPrimary) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-1 flex-col items-center justify-center gap-[clamp(0.75rem,2dvh,2rem)] px-6 py-[clamp(1.5rem,4dvh,4rem)] sm:grid sm:grid-rows-[1fr_auto_1fr] sm:items-stretch sm:justify-items-center sm:gap-0 sm:py-24">
        <div className="flex w-full items-end justify-center sm:pb-[34px]">
          <OnboardHero eyebrow={null} uniformFont />
        </div>
        {children}
        <div className="flex w-full items-start justify-center sm:pt-[34px]">
          <p className="max-w-[760px] text-center text-[13px] font-medium leading-[1.4] text-[#245C80]">
            Nothing is locked in — switch spaces anytime from the sidebar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-1 flex-col items-center justify-center gap-[clamp(0.875rem,2dvh,1.5rem)] px-6 py-[clamp(1.5rem,4dvh,3rem)] sm:gap-[34px] sm:py-24">
      <OnboardHero />
      {children}
      <p className="max-w-[760px] text-center font-sans text-[13px] font-medium leading-[1.4] text-[#245C80]">
        Nothing is locked in — switch spaces anytime from the sidebar.
      </p>
    </main>
  );
}
