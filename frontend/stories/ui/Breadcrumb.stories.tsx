import type { Meta, StoryObj } from "@storybook/react-vite";
import { Breadcrumb } from "../../components/ui/Breadcrumb";
import { ChevronRight } from "lucide-react";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Projects", href: "#" },
      { label: "Current" },
    ],
  },
};

export const WithOnClick: Story = {
  args: {
    items: [
      { label: "Home", onClick: () => console.log("Home clicked") },
      { label: "Projects", onClick: () => console.log("Projects clicked") },
      { label: "Current" },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Projects", href: "#" },
      { label: "Current" },
    ],
    separator: <ChevronRight size={12} />,
  },
};
