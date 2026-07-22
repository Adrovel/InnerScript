import { redirect } from "next/navigation";

export const metadata = {
  title: "Welcome · InnerScript",
  description: "Choose a space to begin in InnerScript.",
};

export default function OnboardPage() {
  redirect("/onboard/v1");
}
