import { useCallback } from "react";
import { Sidebar } from "../../../ui/Sidebar";
import { File, GitBranch, Search, Plus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../../ui/ToggleGroup";
import { tv } from "tailwind-variants";
import { type SortableTreeNode } from "../../../ui/Tree";
import { SortableTree } from "../../../ui/SortableTree";
import { useEditorStore } from "../../../../stores/useEditorStore";
import { useProjectStore } from "../../../../stores/useProjectStore";
import type { Node, FileMetadata } from "../../../../types/rust/bindings";
import { Button } from "../../../ui/Button";

const leftSidebar = tv({
  slots: {
    base: "h-full flex flex-row",
    categories: "flex flex-col",
    contents: "flex-1 flex flex-col overflow-y-auto px-2",
  },
});

/**
 * Converts Rust Node<FileMetadata> to SortableTreeNode<FileMetadata>
 * Business logic removed - this is now just data transformation
 */
function fileNodeToSortable(
  node: Node<FileMetadata>
): SortableTreeNode<FileMetadata> {
  return {
    id: node.data.path,
    label: node.data.name,
    data: node.data,
    children: node.children?.map((child: Node<FileMetadata>) => fileNodeToSortable(child)),
  };
}

export function LeftSidebar() {
  const { base, categories, contents } = leftSidebar();
  const openFile = useEditorStore((state) => state.openFile);
  const tree = useProjectStore((state) => state.tree);
  const createDocument = useProjectStore((state) => state.createDocument);

  // Business logic handlers at component level
  const handleNodeClick = useCallback(
    (node: SortableTreeNode<FileMetadata>) => {
      // TODO: Load document content and open in editor
      console.log("Open file:", node.data.path);
    },
    [openFile]
  );

  const handleCreateChild = useCallback(
    (node: SortableTreeNode<FileMetadata>) => {
      const parentNode: Node<FileMetadata> = {
        data: node.data,
        children: [],
      };
      createDocument(parentNode, "New Document");
    },
    [createDocument]
  );

  // Render actions for each node
  const renderActions = useCallback(
    (node: SortableTreeNode<FileMetadata>) => (
      <Button
        size="sm"
        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          handleCreateChild(node);
        }}
      >
        <Plus size={12} />
      </Button>
    ),
    [handleCreateChild]
  );

  // Transform data
  const treeItems: SortableTreeNode<FileMetadata>[] =
    tree.length > 0 ? tree.map((node: Node<FileMetadata>) => fileNodeToSortable(node)) : [];

  return (
    <Sidebar id="left" className={base()}>
      <section className={categories()}>
        <ToggleGroup type="single" orientation="vertical">
          <ToggleGroupItem value="file" direction="left">
            <File
              strokeWidth={1.5}
              size="32"
              className="text-muted-foreground hover:stroke-1.5"
            />
          </ToggleGroupItem>
          <ToggleGroupItem value="search" direction="left">
            <Search
              strokeWidth={1.5}
              size="32"
              className="text-muted-foreground"
            />
          </ToggleGroupItem>
          <ToggleGroupItem value="version" direction="left">
            <GitBranch
              strokeWidth={1.5}
              size="32"
              className="text-muted-foreground"
            />
          </ToggleGroupItem>
        </ToggleGroup>
      </section>
      <section className={contents()}>
        <SortableTree
          items={treeItems}
          label="파일 탐색기"
          onNodeClick={handleNodeClick}
          renderActions={renderActions}
        />
      </section>
    </Sidebar>
  );
}
