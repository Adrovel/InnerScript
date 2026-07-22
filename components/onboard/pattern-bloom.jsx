import { cn } from "@/lib/utils";

// Path from Brilliant Direction 1 — Pattern Background (viewBox 0 0 200 200)
const BLOOM_PATH =
  "M113.64,100C122.86,76.46,132.89,44.35,132.89,33.22C132.89,14.87,118.02,0,99.67,0C81.32,0,66.45,14.87,66.45,33.22C66.45,44.35,76.48,76.46,85.7,100C76.48,123.54,66.45,155.65,66.45,166.78C66.45,185.13,81.32,200,99.67,200C118.02,200,132.89,185.13,132.89,166.78C132.89,155.65,122.86,123.54,113.64,100ZM100,86.36C76.46,77.14,44.35,67.11,33.22,67.11C14.87,67.11,0,81.98,0,100.33C0,118.68,14.87,133.56,33.22,133.56C44.35,133.56,76.46,123.52,100,114.3C123.53,123.52,155.65,133.56,166.78,133.56C185.13,133.56,200,118.68,200,100.33C200,81.98,185.13,67.11,166.78,67.11C155.65,67.11,123.53,77.14,100,86.36Z";

const BLOOM_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="white" d="${BLOOM_PATH}"/></svg>`,
)}")`;

export function PatternBloom({
  src = "/onboard/mask-bg-sky.png",
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
        WebkitMaskImage: BLOOM_MASK,
        maskImage: BLOOM_MASK,
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
