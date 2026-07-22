import { MASKED_CARD_ASSET_URLS } from "@/components/onboard/pattern-assets";

export default function OnboardLayout({ children }) {
  return (
    <div
      className="flex min-h-dvh w-full flex-1 flex-col overflow-auto overscroll-none"
      style={{
        colorScheme: "light",
        // Hex gradient only — also acts as paint under the liquidGL snapshot layer
        background:
          "linear-gradient(180deg, #EAF7FF 0%, #C5E7FF 50%, #4E9FE6 100%)",
      }}
    >
      {MASKED_CARD_ASSET_URLS.map((href) => (
        <link key={href} rel="preload" as="image" href={href} />
      ))}
      {children}
    </div>
  );
}
