import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardMaskArt } from "./card-mask-art";

const variants = {
  journal: {
    rest: "linear-gradient(160deg, #F8FCFF 0%, #8ED1FF 22%, #0088FF 58%, #0058A8 100%)",
    hover:
      "linear-gradient(160deg, #004C90 0%, #0066C2 28%, #0088FF 58%, #76C9FF 100%)",
    description: "text-[#E5F5FF]",
  },
  events: {
    rest: "linear-gradient(160deg, #FFFFFF 0%, #A8DCFF 22%, #1A94FF 52%, #0088FF 72%, #0066C2 100%)",
    hover:
      "linear-gradient(160deg, #00477F 0%, #0066C2 28%, #0088FF 58%, #8ED8FF 100%)",
    description: "text-[#EDF8FF]",
  },
};

export function SpaceChoiceCard({
  title,
  description,
  href,
  actionLabel = "Get started",
  variant = "journal",
  art,
  translucent = false,
  fitMobileViewport = false,
  className,
}) {
  const styles = variants[variant] ?? variants.journal;

  if (translucent) {
    return (
      /*
        liquidGL model:
        - Target (.onboard-liquid-card) is the glass shell at z-20
        - Shared WebGL canvas sits at z-19 (behind the shell)
        - Content is a CHILD with z-[3] so it paints above the lens
        - Parent must NOT create a low stacking context (see PatternBackground)
      */
      <div
        data-onboard-choice-card
        className={cn(
          // No padding on the shell — Link is absolute inset-0 so the hover footer
          // can slide fully off-card without peeking through padding.
          "onboard-liquid-card relative z-20 w-full max-w-[368px] overflow-hidden rounded-[18px] sm:rounded-[20px]",
          fitMobileViewport
            ? "h-[clamp(11rem,24dvh,13.125rem)] sm:h-[min(470px,58vh)]"
            : "h-[min(470px,58vh)]",
          className,
        )}
        style={{
          // CSS glass fallback (rgba only) — swapped for transparent when WebGL is live
          background: "rgba(255, 255, 255, 0.28)",
          border: "1px solid rgba(255, 255, 255, 0.55)",
          boxShadow:
            "0 10px 36px rgba(15, 70, 130, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
          WebkitBackdropFilter: "blur(28px) saturate(165%)",
          backdropFilter: "blur(28px) saturate(165%)",
        }}
      >
        {/*
          Very light rim only — heavy white wash made cubes through glass look
          washed-out vs the real background. Keep alpha low so refraction matches.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] rounded-[18px] sm:rounded-[20px]"
          style={{
            background:
              "linear-gradient(165deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.04) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.25)",
          }}
        />

        <Link
          href={href}
          className={cn(
            // group lives on the Link — shell has pointer-events:none after WebGL boots
            "group absolute inset-0 z-[3] flex flex-col justify-end p-6 pb-20 outline-none sm:p-9",
            "transition-transform duration-300 ease-out sm:hover:-translate-y-0.5",
            "focus-visible:ring-2 focus-visible:ring-[#0088FF]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#C5E7FF]",
          )}
          style={{ pointerEvents: "auto" }}
        >
          <div
            className={cn(
              "relative flex flex-col gap-2.5 transition-transform duration-300 ease-out",
              "sm:group-hover:-translate-y-16 sm:group-focus-visible:-translate-y-16",
            )}
          >
            <h2
              className="text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-[#0A1F33] sm:text-[30px]"
              style={{ textWrap: "balance" }}
            >
              {title}
            </h2>
            <p className="max-w-[296px] text-[13px] leading-[1.45] text-[rgba(10,31,51,0.74)] sm:text-[15px] sm:leading-[1.55]">
              {description}
            </p>
          </div>

          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex h-14 items-center justify-between rounded-b-[17px] px-6 sm:h-[92px] sm:translate-y-full sm:rounded-b-[19px] sm:px-9",
              "translate-y-0 transition-transform duration-300 ease-out",
              "sm:group-hover:translate-y-0 sm:group-focus-visible:translate-y-0",
            )}
            style={{
              background: "rgba(8, 24, 44, 0.52)",
              borderTop: "1px solid rgba(255, 255, 255, 0.22)",
              WebkitBackdropFilter: "blur(18px) saturate(150%)",
              backdropFilter: "blur(18px) saturate(150%)",
            }}
          >
            <span className="text-[15px] font-semibold leading-[1.2] text-white sm:text-xl">
              {actionLabel}
            </span>
            <ArrowRight
              className="size-5 text-white transition-transform duration-300 group-hover:translate-x-0.5 sm:size-6"
              aria-hidden
              strokeWidth={1.75}
            />
          </div>
        </Link>
      </div>
    );
  }

  return (
    <Link
      data-onboard-choice-card
      href={href}
      className={cn(
        "group relative flex max-w-[368px] flex-col justify-end overflow-hidden rounded-2xl border-white/72 shadow-[0_5px_8px_rgba(0,108,207,0.26)] outline-none transition-[box-shadow,transform,background] duration-300",
        fitMobileViewport
          ? "h-[clamp(10.5rem,22dvh,12rem)] w-full border p-5 pb-[4.25rem] sm:h-[min(470px,58vh)] sm:border-2 sm:p-9"
          : "h-[min(470px,58vh)] w-full border-2 p-9",
        "hover:shadow-[0_5px_8px_rgba(0,108,207,0.30)] focus-visible:ring-2 focus-visible:ring-[#0088FF]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#C5E7FF]",
        className,
      )}
      style={{ backgroundImage: styles.rest }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100"
        style={{ backgroundImage: styles.hover }}
      />

      {fitMobileViewport ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2] sm:hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(0, 64, 126, 0.72) 0%, rgba(0, 91, 174, 0.48) 48%, rgba(0, 105, 196, 0) 78%)",
          }}
        />
      ) : null}

      {art ? (
        <CardMaskArt
          variant={art.variant ?? variant}
          src={art.src}
          fitMobileViewport={fitMobileViewport}
        />
      ) : null}

      <div
        className={cn(
          "relative z-10 flex flex-col transition-transform duration-300 ease-out",
          fitMobileViewport ? "w-[58%] gap-1.5 sm:w-auto sm:gap-2.5" : "gap-2.5",
          fitMobileViewport
            ? "sm:group-hover:-translate-y-16 sm:group-focus-visible:-translate-y-16"
            : "group-hover:-translate-y-16 group-focus-visible:-translate-y-16",
        )}
      >
        <h2
          className={cn(
            "font-semibold leading-[1.2] text-white drop-shadow-[0_1px_8px_rgba(0,40,90,0.35)]",
            fitMobileViewport
              ? "text-2xl sm:text-[30px]"
              : "text-[30px]",
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            "max-w-[296px] drop-shadow-[0_1px_6px_rgba(0,40,90,0.28)]",
            fitMobileViewport
              ? "text-[12px] leading-[1.4] sm:text-[15px] sm:leading-[1.5]"
              : "text-[15px] leading-[1.5]",
            styles.description,
          )}
        >
          {description}
        </p>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex items-center justify-between rounded-b-[14px] bg-[#050505]",
          fitMobileViewport
            ? "h-[52px] translate-y-0 px-5 sm:h-[92px] sm:translate-y-full sm:px-9"
            : "h-[92px] px-9",
          "transition-transform duration-300 ease-out",
          "sm:group-hover:translate-y-0 sm:group-focus-visible:translate-y-0",
        )}
      >
        <span
          className={cn(
            "font-semibold leading-[1.2] text-white",
            fitMobileViewport
              ? "text-[15px] sm:text-xl"
              : "text-xl",
          )}
        >
          {actionLabel}
        </span>
        <ArrowRight
          className={cn("text-white", fitMobileViewport ? "size-5 sm:size-6" : "size-6")}
          aria-hidden
          strokeWidth={1.75}
        />
      </div>
    </Link>
  );
}
