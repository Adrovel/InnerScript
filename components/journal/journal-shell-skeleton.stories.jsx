import { expect } from "storybook/test";
import { JournalShellSkeleton } from "./journal-shell-skeleton";

const meta = {
  component: JournalShellSkeleton,
  tags: ["ai-generated"],
};

export default meta;

export const Loading = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("generic").length).toBeGreaterThan(0);
  },
};
