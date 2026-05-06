import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "../../components/ui/Toggle";
import { Bold } from "lucide-react";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    direction: { control: "select", options: ["left", "right", "top", "bottom"] },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { children: <Bold size={16} /> },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle size="sm"><Bold size={12} /></Toggle>
      <Toggle size="md"><Bold size={16} /></Toggle>
      <Toggle size="lg"><Bold size={20} /></Toggle>
    </div>
  ),
};

export const Directions: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle direction="left"><Bold size={16} /></Toggle>
      <Toggle direction="right"><Bold size={16} /></Toggle>
      <Toggle direction="top"><Bold size={16} /></Toggle>
      <Toggle direction="bottom"><Bold size={16} /></Toggle>
    </div>
  ),
};
