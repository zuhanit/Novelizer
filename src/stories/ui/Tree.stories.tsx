import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tree } from "../../components/ui/Tree";
import type { TreeNode } from "../../components/ui/Tree";
import { File, Folder } from "lucide-react";

const meta: Meta<typeof Tree> = {
  title: "UI/Tree",
  component: Tree,
};

export default meta;
type Story = StoryObj<typeof Tree>;

const basicItems: TreeNode[] = [
  {
    label: "Documents",
    children: [
      { label: "Resume.pdf" },
      { label: "Cover Letter.docx" },
    ],
  },
  {
    label: "Photos",
    children: [
      { label: "Vacation", children: [{ label: "beach.jpg" }, { label: "mountain.jpg" }] },
      { label: "profile.png" },
    ],
  },
  { label: "README.md" },
];

export const Default: Story = {
  args: {
    items: basicItems,
    label: "File Explorer",
  },
};

const deepItems: TreeNode[] = [
  {
    label: "src",
    defaultExpanded: true,
    children: [
      {
        label: "components",
        defaultExpanded: true,
        children: [
          {
            label: "ui",
            children: [
              { label: "Button.tsx" },
              { label: "Toggle.tsx" },
              { label: "Tree.tsx" },
            ],
          },
          {
            label: "layout",
            children: [
              { label: "Header.tsx" },
              { label: "Footer.tsx" },
            ],
          },
        ],
      },
      { label: "App.tsx" },
      { label: "main.tsx" },
    ],
  },
];

export const NestedDeep: Story = {
  args: {
    items: deepItems,
    label: "Project Structure",
  },
};

const iconItems: TreeNode[] = [
  {
    label: "src",
    icon: <Folder size={14} />,
    children: [
      { label: "index.ts", icon: <File size={14} /> },
      { label: "utils.ts", icon: <File size={14} /> },
    ],
  },
  { label: "package.json", icon: <File size={14} /> },
];

export const WithIcons: Story = {
  args: {
    items: iconItems,
    label: "With Icons",
  },
};
