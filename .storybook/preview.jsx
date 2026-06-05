import "../app/globals.css";
import MockDate from "mockdate";
import { initialize, mswLoader } from "msw-storybook-addon";
import { TooltipProvider } from "../components/ui/tooltip";
import { mswHandlers } from "./msw-handlers";

initialize({ onUnhandledRequest: "bypass" });

/** @type { import('@storybook/nextjs-vite').Preview } */
const preview = {
  decorators: [
    (Story) => {
      document.documentElement.classList.add("dark", "antialiased");
      document.documentElement.style.setProperty("--font-inter", "Inter, sans-serif");
      document.documentElement.style.setProperty("--font-manrope", "Manrope, sans-serif");
      document.documentElement.style.setProperty("--font-noto-serif", "Georgia, serif");
      document.documentElement.style.setProperty("--font-public-sans", "Arial, sans-serif");
      document.documentElement.style.setProperty("--font-geist-mono", "monospace");

      return (
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      );
    },
  ],
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    msw: {
      handlers: mswHandlers,
    },
  },
  async beforeEach() {
    MockDate.set("2026-06-05T12:00:00Z");
  },
};

export default preview;
