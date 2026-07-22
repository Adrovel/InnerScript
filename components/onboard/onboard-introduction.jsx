import { ArrowRight } from "lucide-react";

export function OnboardIntroduction({ name, onNameChange, onContinue }) {
  const canContinue = name.trim().length > 0;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[960px] flex-1 px-6 py-16 sm:py-24">
      <form
        className="mx-auto grid min-h-[calc(100dvh-8rem)] w-full max-w-[680px] grid-rows-[1fr_auto_1fr] justify-items-center sm:min-h-[calc(100dvh-12rem)]"
        onSubmit={onContinue}
      >
        <div className="flex w-full flex-col items-center justify-end gap-3 pb-6 text-center sm:pb-8">
          <p className="text-lg font-medium leading-[1.4] text-[#2B6288]">
            Welcome to InnerScript
          </p>
          <label
            htmlFor="onboard-name"
            className="text-[clamp(1.75rem,4vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[#0B3154]"
          >
            How would you like us to call you?
          </label>
        </div>

        <div className="relative w-[calc(100%-4rem)] max-w-[560px]">
          <input
            id="onboard-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            autoComplete="name"
            autoFocus
            maxLength={80}
            required
            className="h-14 w-full min-w-0 border-0 border-b border-[#2B6288]/55 bg-transparent px-1 text-center text-2xl text-[#0B3154] caret-[#0B3154] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#356782]/45 focus-visible:border-[#0B3154] focus-visible:shadow-[0_1px_0_#0B3154] focus-visible:outline-none sm:text-[28px]"
            aria-label="Your name"
          />
          <button
            type="submit"
            disabled={!canContinue}
            aria-label="Continue to choose a space"
            className="group absolute bottom-1 left-full ml-2 flex size-12 shrink-0 items-center justify-center rounded-full text-[#0B3154] outline-none transition-[background-color,color,opacity,transform] duration-200 hover:bg-white/35 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight
              className="size-7 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
              strokeWidth={1.75}
            />
          </button>
        </div>
      </form>
    </main>
  );
}
