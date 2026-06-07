import { TopAppBar } from "./top-app-bar";

const meta = {
  component: TopAppBar,
  tags: ["ai-generated"],
};

export default meta;

export const DesktopSaved = {
  args: {
    saveStatus: "saved",
    saveActivityId: 1,
    lastEditedAt: "just now",
    onRetrySave: () => {},
    onMenuClick: () => {},
  },
};

export const SaveFailed = {
  args: {
    saveStatus: "error",
    saveActivityId: 2,
    lastEditedAt: "2m ago",
    onRetrySave: () => {},
    onMenuClick: () => {},
  },
};
