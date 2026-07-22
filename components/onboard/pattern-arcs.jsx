import { cn } from "@/lib/utils";

// Path from Brilliant Direction 1 — Pattern Background (viewBox 0 0 200 200)
const ARCS_PATH =
  "M100,200L100,0C44.77,0,0,44.77,0,100C0,155.23,44.77,200,100,200ZM200,200L200,0C144.77,0,100,44.77,100,100C100,155.23,144.77,200,200,200Z";

const ARCS_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="white" d="${ARCS_PATH}"/></svg>`,
)}")`;

export function PatternArcs({
  src = "/onboard/mask-bg-cobalt.png",
  className,
  style,
  ...props
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none select-none", className)}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        WebkitMaskImage: ARCS_MASK,
        maskImage: ARCS_MASK,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
      {...props}
    />
  );
}
