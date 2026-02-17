import { Sidebar } from "../../../ui/Sidebar";
import { File, GitBranch, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../../ui/ToggleGroup";
import { tv } from "tailwind-variants";
import {
  DraggableTree,
  DraggableTreeNode,
} from "../../../ui/tree/draggable/DraggableTree";
import { useEditorStore } from "../../../../stores/useEditorStore";
import { useProjectStore } from "../../../../stores/useProjectStore";
import { commands, FileMetadata, Node } from "../../../../types/rust/bindings";
import {
  LeftSidebarContent,
  LeftSidebarItemWrapper,
} from "./LeftSidebarContent";

const leftSidebar = tv({
  slots: {
    base: "h-full flex flex-row",
    categories: "flex flex-col",
    contents: "flex-1 flex flex-col overflow-y-auto px-2 overflow-auto",
  },
});

export function LeftSidebar() {
  const { base, categories, contents } = leftSidebar();
  const openFileByPath = useEditorStore((state) => state.openFileByPath);
  const tree = useProjectStore((state) => state.tree);

  const handleFileSelect = (fileData: FileMetadata) => {
    openFileByPath(fileData.path);
  };

  const handleMove = async (source: FileMetadata, target: FileMetadata) => {
    await commands.moveDocument(source.path, target.path);
  };

  const sidebarDocumentItems = tree.map((node) => nodeToTree(node));

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
        <DraggableTree
          items={sidebarDocumentItems}
          label="파일 탐색기"
          onSelect={handleFileSelect}
          onMove={handleMove}
          TriggerContent={LeftSidebarContent}
          LeafContent={LeftSidebarContent}
          ItemWrapper={LeftSidebarItemWrapper}
        />
      </section>
    </Sidebar>
  );

  function nodeToTree(
    node: Node<FileMetadata>
  ): DraggableTreeNode<FileMetadata> {
    return {
      id: node.data.path,
      label: node.data.name,
      data: node.data,
      children: node.children.map(nodeToTree),
    };
  }
}
