import { useMemo } from "react";
import { tv } from "tailwind-variants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/Tabs";
import { useShallow } from "zustand/react/shallow";
import { useEditorStore } from "../../../stores/useEditorStore";
import { type Block } from "../../../types/rust/bindings";
import { Button } from "../../ui/Button";

const panelVariants = tv({
  slots: {
    base: "flex flex-col w-full bg-ui-background border-t border-editor-gutter-normal",
    content: "h-full p-2",
  },
});

function MemoBlock({ block, onClick }: { block: Block; onClick: () => void }) {
  return (
    <Button
      className="w-full border border-ui-selection-active justify-start cursor-pointer"
      onClick={onClick}
    >
      <p className="text-sm text-foreground">{block.content}</p>
    </Button>
  );
}

export function Panel() {
  const { base, content } = panelVariants();
  const setFocusedBlock = useEditorStore((s) => s.setFocusedBlock);
  const blocks = useEditorStore(
    useShallow((s) => {
      const file = s.openFiles.find((f) => f.id === s.activeTab);
      return file?.blocks ?? [];
    })
  );

  const memoBlocks = useMemo(() => {
    return blocks
      .map((block, index) => ({ block, index }))
      .filter(({ block }) => block.kind === "memo");
  }, [blocks]);

  return (
    <Tabs defaultValue="memo" className={base()}>
      <TabsList>
        <TabsTrigger value="memo">MEMO</TabsTrigger>
        <TabsTrigger value="graph">GRAPH</TabsTrigger>
        <TabsTrigger value="version">VERSION</TabsTrigger>
      </TabsList>
      <TabsContent value="memo" className={content()}>
        {memoBlocks.map(({ block, index }) => (
          <MemoBlock
            key={index}
            block={block}
            onClick={() => setFocusedBlock(index)}
          />
        ))}
      </TabsContent>
      <TabsContent value="graph" className={content()}>
        그래프 내용
      </TabsContent>
      <TabsContent value="version" className={content()}>
        버전 내용
      </TabsContent>
    </Tabs>
  );
}
