import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DraggableTree,
  DraggableTreeRenderComponentType,
  type DraggableTreeNode,
} from "../../components/ui/tree/draggable/DraggableTree";
import { Delete, File, Folder, Plus } from "lucide-react";

const meta: Meta<typeof DraggableTree> = {
  title: "UI/DraggableTree",
  component: DraggableTree,
};

export default meta;
type Story = StoryObj<typeof DraggableTree<string>>;

const items: DraggableTreeNode<string>[] = [
  {
    id: "documents",
    label: "Documents",
    data: "documents",
    children: [
      { id: "resume", label: "Resume.pdf", data: "resume" },
      { id: "cover-letter", label: "Cover Letter.docx", data: "cover-letter" },
    ],
  },
  {
    id: "photos",
    label: "Photos",
    data: "photos",
    children: [
      {
        id: "vacation",
        label: "Vacation",
        data: "vacation",
        children: [
          { id: "beach", label: "beach.jpg", data: "beach" },
          { id: "mountain", label: "mountain.jpg", data: "mountain" },
        ],
      },
      { id: "profile", label: "profile.png", data: "profile" },
    ],
  },
  { id: "readme", label: "README.md", data: "readme" },
];

const RenderComponent: DraggableTreeRenderComponentType<string> = ({
  node,
}) => <>{node.data}</>;

export const Default: Story = {
  args: {
    items,
    label: "File Explorer",
    onSelect: () => {},
    TriggerContent: RenderComponent,
    LeafContent: RenderComponent,
  },
};

type FileMetadata = { lastModified: string; createAt: string };
type ComplexStory = StoryObj<typeof DraggableTree<FileMetadata>>;

const complexItems: DraggableTreeNode<FileMetadata>[] = [
  {
    id: "src",
    label: "src",
    data: { lastModified: "2025-03-02 10:30", createAt: "2020-01-01 10:30" },
    children: [
      {
        id: "components",
        label: "components",
        data: {
          lastModified: "2025-03-01 14:00",
          createAt: "2020-01-01 10:30",
        },
        children: [
          {
            id: "ui",
            label: "ui",
            data: {
              lastModified: "2025-02-28 09:15",
              createAt: "2020-01-01 10:30",
            },
            children: [
              {
                id: "button",
                label: "Button.tsx",
                data: {
                  lastModified: "2025-02-28 09:15",
                  createAt: "2020-02-10 11:00",
                },
              },
              {
                id: "toggle",
                label: "Toggle.tsx",
                data: {
                  lastModified: "2025-02-27 16:45",
                  createAt: "2020-03-05 08:30",
                },
              },
              {
                id: "tree",
                label: "Tree.tsx",
                data: {
                  lastModified: "2025-03-02 10:30",
                  createAt: "2020-04-12 13:20",
                },
              },
            ],
          },
          {
            id: "layout",
            label: "layout",
            data: {
              lastModified: "2025-03-01 14:00",
              createAt: "2020-01-15 09:00",
            },
            children: [
              {
                id: "header",
                label: "Header.tsx",
                data: {
                  lastModified: "2025-03-01 14:00",
                  createAt: "2020-01-15 09:00",
                },
              },
              {
                id: "footer",
                label: "Footer.tsx",
                data: {
                  lastModified: "2025-02-20 11:30",
                  createAt: "2020-01-15 09:30",
                },
              },
            ],
          },
        ],
      },
      {
        id: "app",
        label: "App.tsx",
        data: {
          lastModified: "2025-03-02 08:00",
          createAt: "2020-01-01 10:30",
        },
      },
      {
        id: "main",
        label: "main.tsx",
        data: {
          lastModified: "2025-01-15 12:00",
          createAt: "2020-01-01 10:30",
        },
      },
    ],
  },
  {
    id: "assets",
    label: "assets",
    data: { lastModified: "2025-01-10 09:00", createAt: "2020-01-01 10:30" },
    children: [],
  },
  {
    id: "readme",
    label: "README.md",
    data: { lastModified: "2025-02-15 17:00", createAt: "2020-01-01 10:30" },
  },
  {
    id: "package-json",
    label: "package.json",
    data: { lastModified: "2025-03-01 10:00", createAt: "2020-01-01 10:30" },
  },
];

function InteractionComp({ name }: { name: string }) {
  return (
    <div className="flex opacity-0 hover:opacity-100">
      <Plus onClick={() => console.log(`${name} append child.`)} />
      <Delete onClick={() => console.log(`${name} has deleted.`)} />
    </div>
  );
}

const ComplexTrigger: DraggableTreeRenderComponentType<FileMetadata> = ({
  node,
}) => (
  <span className="flex flex-1 gap-2.5 items-center">
    <Folder size={16} />
    <p className="flex-1">{node.label}</p>
    <InteractionComp name={node.label} />
  </span>
);

const ComplexLeaf: DraggableTreeRenderComponentType<FileMetadata> = ({
  node,
}) => (
  <span className="flex flex-1 gap-2.5 items-center">
    <File size={16} />
    <p className="flex-1">{node.label}</p>
    <InteractionComp name={node.label} />
  </span>
);

export const Complex: ComplexStory = {
  args: {
    items: complexItems,
    label: "File Explorer",
    onSelect: (data) => console.log("selected:", data),
    TriggerContent: ComplexTrigger,
    LeafContent: ComplexLeaf,
  },
};
