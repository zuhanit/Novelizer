import { Sidebar } from "../../../ui/Sidebar";
import { File, GitBranch, Search } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../../../ui/ToggleGroup";
import { tv } from "tailwind-variants";
import { type SortableTreeNode } from "../../../ui/Tree";
import { SortableTree } from "../../../ui/SortableTree";
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

  const treeItems: SortableTreeNode[] = [
    {
      id: "story-1",
      label: "책과 시간",
      children: [
        {
          id: "characters",
          label: "인물",
          onSelect: () => handleFileSelect("characters"),
          children: [
            {
              id: "char-minsu",
              label: "민수",
              onSelect: () => handleFileSelect("char-minsu"),
            },
            {
              id: "char-sujin",
              label: "수진",
              onSelect: () => handleFileSelect("char-sujin"),
            },
            {
              id: "char-yerin",
              label: "예린",
              onSelect: () => handleFileSelect("char-yerin"),
            },
          ],
        },
        {
          id: "events",
          label: "사건",
          onSelect: () => handleFileSelect("events"),
          children: [
            {
              id: "event-poem-purchase",
              label: "시집 구매 시도",
              onSelect: () => handleFileSelect("event-poem-purchase"),
            },
            {
              id: "event-gift",
              label: "시집 선물",
              onSelect: () => handleFileSelect("event-gift"),
            },
          ],
        },
        {
          id: "structure",
          label: "구성 요소",
          onSelect: () => handleFileSelect("structure"),
          children: [
            {
              id: "intro",
              label: "발단",
              onSelect: () => handleFileSelect("intro"),
              children: [
                {
                  id: "intro-01",
                  label: "(01)",
                  onSelect: () => handleFileSelect("intro-01"),
                },
              ],
            },
            {
              id: "development",
              label: "전개",
              onSelect: () => handleFileSelect("development"),
              children: [
                {
                  id: "development-01",
                  label: "(01)",
                  onSelect: () => handleFileSelect("development-01"),
                },
                {
                  id: "development-02",
                  label: "(02)",
                  onSelect: () => handleFileSelect("development-02"),
                },
                {
                  id: "development-03",
                  label: "(03)",
                  onSelect: () => handleFileSelect("development-03"),
                },
              ],
            },
            {
              id: "crisis",
              label: "위기",
              onSelect: () => handleFileSelect("crisis"),
            },
            {
              id: "climax",
              label: "절정",
              onSelect: () => handleFileSelect("climax"),
            },
            {
              id: "ending",
              label: "결말",
              onSelect: () => handleFileSelect("ending"),
            },
          ],
        },
      ],
    },
  ];

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
        <SortableTree items={treeItems} label="파일 탐색기" />
      </section>
    </Sidebar>
  );
}
