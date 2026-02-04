import type { Meta, StoryObj } from "@storybook/react-vite";
import { SortableTree } from "../../components/ui/SortableTree";
import type { SortableTreeNode } from "../../components/ui/Tree";

const meta: Meta<typeof SortableTree> = {
  title: "UI/SortableTree",
  component: SortableTree,
};

export default meta;
type Story = StoryObj<typeof SortableTree>;

const items: SortableTreeNode[] = [
  {
    id: "project",
    label: "Project",
    children: [
      {
        id: "characters",
        label: "Characters",
        children: [
          { id: "char-1", label: "Alice" },
          { id: "char-2", label: "Bob" },
          { id: "char-3", label: "Charlie" },
        ],
      },
      {
        id: "chapters",
        label: "Chapters",
        children: [
          { id: "ch-1", label: "Chapter 1" },
          { id: "ch-2", label: "Chapter 2" },
          { id: "ch-3", label: "Chapter 3" },
        ],
      },
      { id: "notes", label: "Notes" },
    ],
  },
];

export const Default: Story = {
  args: {
    items,
    label: "Sortable File Explorer",
  },
};
