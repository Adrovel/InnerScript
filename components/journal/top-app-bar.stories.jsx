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
    onRetrySave: () => {},
    onMenuClick: () => {},
  },
};

export const SaveFailed = {
  args: {
    saveStatus: "error",
    saveActivityId: 2,
    onRetrySave: () => {},
    onMenuClick: () => {},
  },
};
