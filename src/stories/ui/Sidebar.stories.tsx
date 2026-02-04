import type { Meta, StoryObj } from "@storybook/react-vite";
import { SidebarProvider, Sidebar, SidebarTrigger } from "../../components/ui/Sidebar";
import { PanelLeft } from "lucide-react";

const meta: Meta<typeof Sidebar> = {
  title: "UI/Sidebar",
  component: Sidebar,
  decorators: [
    (Story) => (
      <SidebarProvider defaultSidebars={{ demo: { open: true } }}>
        <div className="flex h-64">
          <Story />
        </div>
      </SidebarProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    id: "demo",
    children: <div className="p-4 text-xs text-muted-foreground">Sidebar content</div>,
  },
};

export const WithTrigger: Story = {
  decorators: [
    () => (
      <SidebarProvider defaultSidebars={{ demo: { open: true } }}>
        <div className="flex h-64">
          <Sidebar id="demo">
            <div className="p-4 text-xs text-muted-foreground">Sidebar content</div>
          </Sidebar>
          <div className="p-2">
            <SidebarTrigger id="demo">
              <PanelLeft size={16} />
            </SidebarTrigger>
          </div>
        </div>
      </SidebarProvider>
    ),
  ],
};
