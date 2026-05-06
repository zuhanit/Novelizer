import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: "Button" },
};

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Medium: Story = {
  args: { size: "md", children: "Medium" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

export const AsChild: Story = {
  render: () => (
    <Button asChild>
      <a href="#">Link as Button</a>
    </Button>
  ),
};
