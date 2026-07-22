import { cn } from "@/lib/utils";
import { CubeRainField } from "./cube-rain-field";

/**
 * Snapshot layer is intentionally isolated from the UI tree.
 * liquidGL's built-in html2canvas path crashes on Tailwind v4 oklab()/color() values;
 * we paint the snapshot ourselves (see use-liquid-glass). Cubes still live here so
 * the live media path can sample them.
 *
 * Stacking (critical for liquidGL):
 * - snapshot / cubes: z-0
 * - UI root: no z-index (do not trap lenses below the body-fixed WebGL canvas)
 * - glass targets use z-20; liquidGL places its canvas at z-19
 * - card content sits inside each target at z-[3] so labels paint above the glass
 */
export function PatternBackground({ children, className, onFieldReady }) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh w-full flex-col overflow-x-hidden overflow-y-auto sm:overflow-hidden",
        className,
      )}
    >
      <div
        id="onboard-liquid-snapshot"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{
          // Keep every parsed color in html2canvas' supported syntax. The global
          // Tailwind base otherwise resolves border/outline to color()/oklab().
          background:
            "linear-gradient(180deg, #EAF7FF 0%, #C5E7FF 50%, #4E9FE6 100%)",
          borderColor: "rgba(0, 0, 0, 0)",
          outlineColor: "rgba(0, 0, 0, 0)",
        }}
      >
        <CubeRainField onReady={onFieldReady} />
      </div>

      <div className="relative flex min-h-dvh w-full flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
