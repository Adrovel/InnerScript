import { cn } from "@/lib/utils";

// Paths from Brilliant Direction 1 — Masked Cards
const BLOOM_PATH =
  "M113.64,100C122.86,76.46,132.89,44.35,132.89,33.22C132.89,14.87,118.02,0,99.67,0C81.32,0,66.45,14.87,66.45,33.22C66.45,44.35,76.48,76.46,85.7,100C76.48,123.54,66.45,155.65,66.45,166.78C66.45,185.13,81.32,200,99.67,200C118.02,200,132.89,185.13,132.89,166.78C132.89,155.65,122.86,123.54,113.64,100ZM100,86.36C76.46,77.14,44.35,67.11,33.22,67.11C14.87,67.11,0,81.98,0,100.33C0,118.68,14.87,133.56,33.22,133.56C44.35,133.56,76.46,123.52,100,114.3C123.53,123.52,155.65,133.56,166.78,133.56C185.13,133.56,200,118.68,200,100.33C200,81.98,185.13,67.11,166.78,67.11C155.65,67.11,123.53,77.14,100,86.36Z";

const ARCS_PATH =
  "M100,200L100,0C44.77,0,0,44.77,0,100C0,155.23,44.77,200,100,200ZM200,200L200,0C144.77,0,100,44.77,100,100C100,155.23,144.77,200,200,200Z";

// Exact group frames from Brilliant card art (rest + hover)
const ART_LAYOUT = {
  journal: {
    // gr p(34,26) s(300,300); vector p(100,100) s(200,200)
    restClass:
      "left-[34px] top-[26px] h-[300px] w-[300px] group-hover:left-[64px] group-hover:top-[18px] group-hover:h-[240px] group-hover:w-[240px] group-focus-visible:left-[64px] group-focus-visible:top-[18px] group-focus-visible:h-[240px] group-focus-visible:w-[240px]",
    mobileFitClass:
      "right-[-4%] top-[-18%] aspect-square w-[58%] sm:right-auto sm:left-[34px] sm:top-[26px] sm:h-[300px] sm:w-[300px] sm:group-hover:left-[64px] sm:group-hover:top-[18px] sm:group-hover:h-[240px] sm:group-hover:w-[240px] sm:group-focus-visible:left-[64px] sm:group-focus-visible:top-[18px] sm:group-focus-visible:h-[240px] sm:group-focus-visible:w-[240px]",
    viewBox: "0 0 300 300",
    imageSize: 300,
    path: BLOOM_PATH,
    pathX: 100,
    pathY: 100,
  },
  events: {
    // gr p(44,28) s(281,281); vector p(0,0) s(200,200)
    restClass:
      "left-[44px] top-[28px] h-[281px] w-[281px] group-hover:left-[72px] group-hover:top-[22px] group-hover:h-[225px] group-hover:w-[225px] group-focus-visible:left-[72px] group-focus-visible:top-[22px] group-focus-visible:h-[225px] group-focus-visible:w-[225px]",
    mobileFitClass:
      "right-[-2%] top-[-14%] aspect-square w-[54%] sm:right-auto sm:left-[44px] sm:top-[28px] sm:h-[281px] sm:w-[281px] sm:group-hover:left-[72px] sm:group-hover:top-[22px] sm:group-hover:h-[225px] sm:group-hover:w-[225px] sm:group-focus-visible:left-[72px] sm:group-focus-visible:top-[22px] sm:group-focus-visible:h-[225px] sm:group-focus-visible:w-[225px]",
    viewBox: "0 0 281 281",
    imageSize: 281,
    path: ARCS_PATH,
    pathX: 0,
    pathY: 0,
  },
};

export function CardMaskArt({ variant = "journal", src, fitMobileViewport = false, className }) {
  const layout = ART_LAYOUT[variant] ?? ART_LAYOUT.journal;
  const maskId = `card-mask-${variant}`;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-[1] transition-[left,top,width,height] duration-300 ease-out",
        fitMobileViewport ? layout.mobileFitClass : layout.restClass,
        className,
      )}
    >
      <svg
        className="size-full"
        viewBox={layout.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={layout.imageSize}
            height={layout.imageSize}
          >
            <rect
              width={layout.imageSize}
              height={layout.imageSize}
              fill="black"
            />
            <g transform={`translate(${layout.pathX} ${layout.pathY})`}>
              <path d={layout.path} fill="white" />
            </g>
          </mask>
        </defs>
        <image
          href={src}
          width={layout.imageSize}
          height={layout.imageSize}
          preserveAspectRatio="xMidYMid slice"
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
}
