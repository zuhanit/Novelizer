import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  FolderPlus,
  FilePlus,
  Pencil,
  ChevronRight,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuLabel,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from "../../components/ui/ContextMenu";

const meta: Meta<typeof ContextMenu> = {
  title: "UI/ContextMenu",
  component: ContextMenu,
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

const TriggerArea = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed border-ui-line text-xs text-muted-foreground">
    {children ?? "Right-click here."}
  </div>
);

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerArea />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Copy size={14} /> Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Scissors size={14} /> Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Clipboard size={14} /> Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Trash2 size={14} /> Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithLabelsAndGroups: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerArea>Right-click — Labels & Groups</TriggerArea>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Edit</ContextMenuLabel>
        <ContextMenuGroup>
          <ContextMenuItem>
            <Copy size={14} /> Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <Scissors size={14} /> Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <Clipboard size={14} /> Paste
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuLabel>File</ContextMenuLabel>
        <ContextMenuGroup>
          <ContextMenuItem>
            <FilePlus size={14} /> New Document
          </ContextMenuItem>
          <ContextMenuItem>
            <FolderPlus size={14} /> New Folder
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerArea>Right-click — Submenu</TriggerArea>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <FilePlus size={14} /> New Document
        </ContextMenuItem>
        <ContextMenuItem>
          <FolderPlus size={14} /> New Folder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Pencil size={14} /> Export
            <span className="ml-auto">
              <ChevronRight size={14} />
            </span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>PDF</ContextMenuItem>
            <ContextMenuItem>EPUB</ContextMenuItem>
            <ContextMenuItem>Markdown</ContextMenuItem>
            <ContextMenuItem>HTML</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>
          <Trash2 size={14} /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCheckboxItems: Story = {
  render: function Render() {
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [showWordCount, setShowWordCount] = useState(false);
    const [showSpellCheck, setShowSpellCheck] = useState(true);

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <TriggerArea>Right-click — Checkbox</TriggerArea>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>View Options</ContextMenuLabel>
          <ContextMenuCheckboxItem
            checked={showLineNumbers}
            onCheckedChange={setShowLineNumbers}
          >
            Line Numbers
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showWordCount}
            onCheckedChange={setShowWordCount}
          >
            Word Count
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showSpellCheck}
            onCheckedChange={setShowSpellCheck}
          >
            Spell Check
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const WithRadioItems: Story = {
  render: function Render() {
    const [fontSize, setFontSize] = useState("medium");

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <TriggerArea>Right-click — Radio</TriggerArea>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Font Size</ContextMenuLabel>
          <ContextMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
            <ContextMenuRadioItem value="small">Small</ContextMenuRadioItem>
            <ContextMenuRadioItem value="medium">Medium</ContextMenuRadioItem>
            <ContextMenuRadioItem value="large">Large</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};

export const DisabledItems: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <TriggerArea>Right-click — Disabled Items</TriggerArea>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Copy size={14} /> Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          <Scissors size={14} /> Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <Clipboard size={14} /> Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>
          <Trash2 size={14} /> Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
