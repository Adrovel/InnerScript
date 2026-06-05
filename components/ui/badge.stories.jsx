import { expect } from "storybook/test";
import { Badge } from "./badge";

const meta = {
  component: Badge,
  tags: ["ai-generated"],
};

export default meta;

export const Journal = {
  args: {
    children: "#JOURNAL",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("#JOURNAL")).toHaveAttribute("data-slot", "badge");
  },
};

export const Secondary = {
  args: {
    children: "Context ready",
    variant: "secondary",
  },
};

export const Outline = {
  args: {
    children: "Source linked",
    variant: "outline",
  },
};
