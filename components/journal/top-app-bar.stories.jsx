import { SidebarProvider } from "@/components/ui/sidebar";
import { TopAppBar } from "./top-app-bar";

const meta = {
  component: TopAppBar,
  tags: ["ai-generated"],
  decorators: [
    (Story) => (
      <SidebarProvider style={{ "--sidebar-width": "280px" }}>
        <Story />
      </SidebarProvider>
    ),
  ],
};

export default meta;

export const DesktopSaved = {
  args: {
    breadcrumbItems: [
      { label: "Journal" },
      { label: "Morning notes", current: true },
    ],
    saveStatus: "saved",
    saveActivityId: 1,
    onRetrySave: () => {},
    onMenuClick: () => {},
  },
};

export const SaveFailed = {
  args: {
    breadcrumbItems: [
      { label: "Notes" },
      { label: "Relationship patterns", current: true },
    ],
    saveStatus: "error",
    saveActivityId: 2,
    onRetrySave: () => {},
    onMenuClick: () => {},
  },
};

export const CollapsedSidebar = {
  decorators: [
    (Story) => (
      <SidebarProvider defaultOpen={false} style={{ "--sidebar-width": "280px" }}>
        <Story />
      </SidebarProvider>
    ),
  ],
  args: {
    breadcrumbItems: [
      { label: "Journal" },
      { label: "Morning notes", current: true },
    ],
    saveStatus: "saved",
    saveActivityId: 1,
    onRetrySave: () => {},
    onMenuClick: () => {},
  },
};
