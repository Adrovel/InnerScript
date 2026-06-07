import { expect } from "storybook/test";
import { SaveStatus } from "./save-status";

const meta = {
  component: SaveStatus,
  tags: ["ai-generated"],
};

export default meta;

export const Saved = {
  args: {
    status: "saved",
    activityId: 1,
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/saved/i)).toBeVisible();
  },
};

export const Saving = {
  args: {
    status: "saving",
    activityId: 2,
  },
};

export const FailedWithRetry = {
  args: {
    status: "error",
    activityId: 3,
    onRetry: () => {},
  },
};
