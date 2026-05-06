import { useState, useRef, useEffect } from "react";
import { DraggableTreeNode } from "../../../ui/tree/draggable/DraggableTree";
import { useEditorStore } from "../../../../stores/useEditorStore";
import { useProjectStore } from "../../../../stores/useProjectStore";
import { commands, FileMetadata, Node } from "../../../../types/rust/bindings";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../../ui/ContextMenu";
import { revealItemInDir } from "@tauri-apps/plugin-opener";

export function LeftSidebarContent({
  node,
}: {
  node: DraggableTreeNode<FileMetadata>;
}) {
  return <span className="text-xs truncate text-foreground">{node.label}</span>;
}

export function LeftSidebarItemWrapper({
  node,
  children,
}: {
  node: DraggableTreeNode<FileMetadata>;
  children: React.ReactNode;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const willRenameRef = useRef(false);

  const openFileByPath = useEditorStore((state) => state.openFileByPath);
  const tree = useProjectStore((state) => state.tree);
  const createDocument = useProjectStore((state) => state.createDocument);
  const deleteDocument = useProjectStore((state) => state.deleteDocument);

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const handleRename = async (newName: string) => {
    setIsRenaming(false);
    const trimmed = newName.trim();
    if (!trimmed || trimmed === node.label) return;

    await commands.renameDocument(node.data.path, trimmed);
  };

  if (isRenaming) {
    return (
      <input
        ref={inputRef}
        autoFocus
        defaultValue={node.label}
        className="text-xs bg-transparent outline-none ring-1 ring-ui-foreground rounded-sm px-1 w-full"
        onBlur={(e) => handleRename(e.currentTarget.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            handleRename(e.currentTarget.value);
          } else if (e.key === "Escape") {
            setIsRenaming(false);
          }
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent
        onCloseAutoFocus={(e) => {
          if (willRenameRef.current) {
            e.preventDefault();
            willRenameRef.current = false;
          }
        }}
      >
        <ContextMenuItem
          onSelect={async () => {
            const fileNode = findFileNode(node.data.path, tree);
            if (fileNode) {
              await createDocument(fileNode, "New Document");
            }
          }}
        >
          New Document...
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => revealItemInDir(node.data.path)}>
          Reveal in Finder
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => openFileByPath(node.data.path)}>
          Open
        </ContextMenuItem>
        <ContextMenuItem disabled>Open in new window</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onSelect={async () => {
            await commands.duplicateDocument(node.data.path);
          }}
        >
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={() => {
            willRenameRef.current = true;
            setIsRenaming(true);
          }}
        >
          Rename
        </ContextMenuItem>
        <ContextMenuItem disabled>Move</ContextMenuItem>
        <ContextMenuItem onSelect={() => deleteDocument(node.data.path)}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function findFileNode(
  path: string,
  nodes: Node<FileMetadata>[]
): Node<FileMetadata> | null {
  for (const node of nodes) {
    if (node.data.path === path) return node;
    const found = findFileNode(path, node.children);
    if (found) return found;
  }
  return null;
}
