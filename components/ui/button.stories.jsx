import { expect } from "storybook/test";
import { Download, Plus } from "lucide-react";
import { Button } from "./button";

const meta = {
  component: Button,
  tags: ["ai-generated"],
};

export default meta;

export const Primary = {
  args: {
    children: "Save entry",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: /save entry/i })).toHaveAttribute(
      "data-slot",
      "button",
    );
  },
};

export const Outline = {
  args: {
    children: "Export",
    variant: "outline",
  },
};

export const WithIcon = {
  args: {
    children: (
      <>
        <Plus aria-hidden="true" />
        New note
      </>
    ),
  },
};

export const IconOnly = {
  args: {
    "aria-label": "Download",
    children: <Download aria-hidden="true" />,
    size: "icon",
    variant: "secondary",
  },
};

export const CssCheck = {
  args: {
    children: "Styled button",
  },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: /styled button/i });
    await expect(getComputedStyle(button).backgroundColor).toBe("rgb(177, 197, 255)");
  },
};
