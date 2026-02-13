import { Sidebar } from "../../../ui/Sidebar";
import { File, GitBranch, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../../ui/ToggleGroup";
import { tv } from "tailwind-variants";
import {
  DraggableTree,
  type DraggableTreeNode,
  type DraggableTreeRenderComponentType,
} from "../../../ui/tree/draggable/DraggableTree";
import { useEditorStore } from "../../../../stores/useEditorStore";
import { mockFiles } from "../../../../data/mockFiles";

const leftSidebar = tv({
  slots: {
    base: "h-full flex flex-row",
    categories: "flex flex-col",
    contents: "flex-1 flex flex-col overflow-y-auto px-2",
  },
});

export function LeftSidebar() {
  const { base, categories, contents } = leftSidebar();
  const openFile = useEditorStore((state) => state.openFile);

  const handleFileSelect = (fileId: string) => {
    const file = mockFiles[fileId];
    if (file) {
      openFile(file);
    }
  };

  const treeItems: DraggableTreeNode<string>[] = [
    {
      id: "story-1",
      label: "책과 시간",
      data: "story-1",
      children: [
        {
          id: "characters",
          label: "인물",
          data: "characters",
          children: [
            { id: "char-minsu", label: "민수", data: "char-minsu" },
            { id: "char-sujin", label: "수진", data: "char-sujin" },
            { id: "char-yerin", label: "예린", data: "char-yerin" },
          ],
        },
        {
          id: "events",
          label: "사건",
          data: "events",
          children: [
            { id: "event-poem-purchase", label: "시집 구매 시도", data: "event-poem-purchase" },
            { id: "event-gift", label: "시집 선물", data: "event-gift" },
          ],
        },
        {
          id: "structure",
          label: "구성 요소",
          data: "structure",
          children: [
            {
              id: "intro",
              label: "발단",
              data: "intro",
              children: [{ id: "intro-01", label: "(01)", data: "intro-01" }],
            },
            {
              id: "development",
              label: "전개",
              data: "development",
              children: [
                { id: "development-01", label: "(01)", data: "development-01" },
                { id: "development-02", label: "(02)", data: "development-02" },
                { id: "development-03", label: "(03)", data: "development-03" },
              ],
            },
            { id: "crisis", label: "위기", data: "crisis" },
            { id: "climax", label: "절정", data: "climax" },
            { id: "ending", label: "결말", data: "ending" },
          ],
        },
      ],
    },
  ];

  const TriggerContent: DraggableTreeRenderComponentType<string> = ({
    node,
  }) => <>{node.label}</>;

  const LeafContent: DraggableTreeRenderComponentType<string> = ({ node }) => (
    <>{node.label}</>
  );

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
          items={treeItems}
          label="파일 탐색기"
          onSelect={handleFileSelect}
          TriggerContent={TriggerContent}
          LeafContent={LeafContent}
        />
      </section>
    </Sidebar>
  );
}
