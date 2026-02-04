import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/ToggleGroup";
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";

const meta: Meta<typeof ToggleGroup> = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left"><AlignLeft size={16} /></ToggleGroupItem>
      <ToggleGroupItem value="center"><AlignCenter size={16} /></ToggleGroupItem>
      <ToggleGroupItem value="right"><AlignRight size={16} /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold"><Bold size={16} /></ToggleGroupItem>
      <ToggleGroupItem value="italic"><Italic size={16} /></ToggleGroupItem>
      <ToggleGroupItem value="underline"><Underline size={16} /></ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ToggleGroup type="single" orientation="vertical" defaultValue="left">
      <ToggleGroupItem value="left" direction="left"><AlignLeft size={16} /></ToggleGroupItem>
      <ToggleGroupItem value="center" direction="left"><AlignCenter size={16} /></ToggleGroupItem>
      <ToggleGroupItem value="right" direction="left"><AlignRight size={16} /></ToggleGroupItem>
    </ToggleGroup>
  ),
};
