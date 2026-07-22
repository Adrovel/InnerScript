import { Manrope } from "next/font/google";
import { OnboardScreenV2 } from "@/components/onboard/onboard-screen";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Welcome · V2 · InnerScript",
  description: "Onboarding masked cards — choose a space to begin.",
};

export default function OnboardV2Page() {
  return <OnboardScreenV2 className={manrope.className} />;
}
