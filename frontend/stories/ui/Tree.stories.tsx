import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Tree,
  TreeItem,
  TreeGroup,
  TreeGroupTrigger,
  TreeGroupContent,
} from "../../components/ui/tree/Tree";
import { Delete, File, Folder, Plus } from "lucide-react";
const meta: Meta<typeof Tree> = {
  title: "UI/Tree",
  component: Tree,
  args: {
    onSelect: (item: unknown) => console.log("selected:", item),
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

export const Default: Story = {
  args: {
    label: "File Explorer",
  },
  render: (args) => (
    <Tree {...args}>
      <TreeGroup data="documents">
        <TreeGroupTrigger>Documents</TreeGroupTrigger>
        <TreeGroupContent>
          <TreeItem data="resume">Resume.pdf</TreeItem>
          <TreeItem data="cover-letter">Cover Letter.docx</TreeItem>
        </TreeGroupContent>
      </TreeGroup>
      <TreeGroup data="photos">
        <TreeGroupTrigger>Photos</TreeGroupTrigger>
        <TreeGroupContent>
          <TreeGroup data="vacation">
            <TreeGroupTrigger>Vacation</TreeGroupTrigger>
            <TreeGroupContent>
              <TreeItem data="beach">beach.jpg</TreeItem>
              <TreeItem data="mountain">mountain.jpg</TreeItem>
            </TreeGroupContent>
          </TreeGroup>
          <TreeItem data="profile">profile.png</TreeItem>
        </TreeGroupContent>
      </TreeGroup>
      <TreeItem data="readme">README.md</TreeItem>
    </Tree>
  ),
};

export const NestedDeep: Story = {
  args: {
    label: "Project Structure",
  },
  render: (args) => (
    <Tree {...args}>
      <TreeGroup data="src">
        <TreeGroupTrigger>src</TreeGroupTrigger>
        <TreeGroupContent>
          <TreeGroup data="components">
            <TreeGroupTrigger>components</TreeGroupTrigger>
            <TreeGroupContent>
              <TreeGroup data="ui">
                <TreeGroupTrigger>ui</TreeGroupTrigger>
                <TreeGroupContent>
                  <TreeItem data="button">Button.tsx</TreeItem>
                  <TreeItem data="toggle">Toggle.tsx</TreeItem>
                  <TreeItem data="tree">Tree.tsx</TreeItem>
                </TreeGroupContent>
              </TreeGroup>
              <TreeGroup data="layout">
                <TreeGroupTrigger>layout</TreeGroupTrigger>
                <TreeGroupContent>
                  <TreeItem data="header">Header.tsx</TreeItem>
                  <TreeItem data="footer">Footer.tsx</TreeItem>
                </TreeGroupContent>
              </TreeGroup>
            </TreeGroupContent>
          </TreeGroup>
          <TreeItem data="app">App.tsx</TreeItem>
          <TreeItem data="main">main.tsx</TreeItem>
        </TreeGroupContent>
      </TreeGroup>
    </Tree>
  ),
};

type FileMetadata = { lastModified: string; createAt: string };
type File =
  | { name: string; metadata: FileMetadata; kind: "file" }
  | {
      name: string;
      metadata: FileMetadata;
      kind: "directory";
      children: File[];
    };

const MockFiles: File[] = [
  {
    name: "src",
    metadata: {
      lastModified: "2025-03-02 10:30",
      createAt: "2020-01-01 10:30",
    },
    kind: "directory",
    children: [
      {
        name: "components",
        metadata: {
          lastModified: "2025-03-01 14:00",
          createAt: "2020-01-01 10:30",
        },
        kind: "directory",
        children: [
          {
            name: "ui",
            metadata: {
              lastModified: "2025-02-28 09:15",
              createAt: "2020-01-01 10:30",
            },
            kind: "directory",
            children: [
              {
                name: "Button.tsx",
                metadata: {
                  lastModified: "2025-02-28 09:15",
                  createAt: "2020-02-10 11:00",
                },
                kind: "file",
              },
              {
                name: "Toggle.tsx",
                metadata: {
                  lastModified: "2025-02-27 16:45",
                  createAt: "2020-03-05 08:30",
                },
                kind: "file",
              },
              {
                name: "Tree.tsx",
                metadata: {
                  lastModified: "2025-03-02 10:30",
                  createAt: "2020-04-12 13:20",
                },
                kind: "file",
              },
            ],
          },
          {
            name: "layout",
            metadata: {
              lastModified: "2025-03-01 14:00",
              createAt: "2020-01-15 09:00",
            },
            kind: "directory",
            children: [
              {
                name: "Header.tsx",
                metadata: {
                  lastModified: "2025-03-01 14:00",
                  createAt: "2020-01-15 09:00",
                },
                kind: "file",
              },
              {
                name: "Footer.tsx",
                metadata: {
                  lastModified: "2025-02-20 11:30",
                  createAt: "2020-01-15 09:30",
                },
                kind: "file",
              },
            ],
          },
        ],
      },
      {
        name: "App.tsx",
        metadata: {
          lastModified: "2025-03-02 08:00",
          createAt: "2020-01-01 10:30",
        },
        kind: "file",
      },
      {
        name: "main.tsx",
        metadata: {
          lastModified: "2025-01-15 12:00",
          createAt: "2020-01-01 10:30",
        },
        kind: "file",
      },
    ],
  },
  {
    name: "assets",
    metadata: {
      lastModified: "2025-01-10 09:00",
      createAt: "2020-01-01 10:30",
    },
    kind: "directory",
    children: [],
  },
  {
    name: "README.md",
    metadata: {
      lastModified: "2025-02-15 17:00",
      createAt: "2020-01-01 10:30",
    },
    kind: "file",
  },
  {
    name: "package.json",
    metadata: {
      lastModified: "2025-03-01 10:00",
      createAt: "2020-01-01 10:30",
    },
    kind: "file",
  },
];

const InteractionComp = ({ file }: { file: File }) => {
  const onClickCreate = () => console.log(`${file.name} append child.`);
  const onClickDelete = () => console.log(`${file.name} has deleted.`);
  return (
    <div className="flex opacity-0 hover:opacity-100">
      <Plus onClick={onClickCreate} />
      <Delete onClick={onClickDelete} />
    </div>
  );
};

function renderFileTree(files: File[]) {
  return files.map((file) =>
    file.kind === "directory" ? (
      <TreeGroup key={file.name} data={file}>
        <TreeGroupTrigger>
          <span className="flex flex-1 gap-2.5 items-center">
            <Folder size={16} />
            <p className="flex-1">{file.name}</p>
            <InteractionComp file={file} />
          </span>
        </TreeGroupTrigger>
        <TreeGroupContent>{renderFileTree(file.children)}</TreeGroupContent>
      </TreeGroup>
    ) : (
      <TreeItem key={file.name} data={file}>
        <span className="flex flex-1 gap-2.5 items-center">
          <File size={16} />
          <p className="flex-1">{file.name}</p>
          <InteractionComp file={file} />
        </span>
      </TreeItem>
    )
  );
}

export const Complex: Story = {
  args: {
    label: "File Explorer",
  },
  render: (args) => <Tree {...args}>{renderFileTree(MockFiles)}</Tree>,
};
