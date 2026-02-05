import { useRef, useEffect } from "react";
import { tv } from "tailwind-variants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../ui/Tabs";
import { Block } from "./Block";
import { Button } from "../../../ui/Button";
import { X } from "lucide-react";
import { useEditorStore } from "../../../../stores/useEditorStore";

const editorVariants = tv({
  slots: {
    base: "flex flex-col bg-ui-background w-full h-full",
    tabTrigger: [
      "group flex items-center gap-2.5 px-3 py-1.5",
      "text-xs text-muted-foreground",
      "border-b border-transparent transition-colors duration-150",
      "hover:text-foreground",
      "data-[state=active]:text-foreground",
      "data-[state=active]:border-accent-enabled",
    ],
    content: "flex-1 w-full overflow-y-auto",
    blocks: "flex flex-col items-center w-175 mx-auto",
    empty:
      "flex-1 flex items-center justify-center text-muted-foreground text-sm",
  },
});

export function Editor() {
  const { base, tabTrigger, content, blocks, empty } = editorVariants();
  const {
    openFiles,
    activeTab,
    closeFile,
    setActiveTab,
    focusedBlockIndex,
    setFocusedBlock,
  } = useEditorStore();
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  const handleClose = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    closeFile(fileId);
  };

  // Scroll to focused block when focusedBlockIndex changes
  useEffect(() => {
    if (focusedBlockIndex !== null && blockRefs.current[focusedBlockIndex]) {
      blockRefs.current[focusedBlockIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focusedBlockIndex]);

  if (openFiles.length === 0) {
    return (
      <div className={base()}>
        <div className={empty()}>열린 파일이 없습니다</div>
      </div>
    );
  }

  return (
    <Tabs
      value={activeTab ?? undefined}
      onValueChange={setActiveTab}
      className={base()}
    >
      <TabsList>
        {openFiles.map((file) => (
          <TabsTrigger key={file.id} value={file.id} className={tabTrigger()}>
            <div>
              <span className="group-data-[state=active]:font-semibold">
                {file.fileName}
              </span>
              <Button asChild onClick={(e) => handleClose(e, file.id)}>
                <span>
                  <X
                    size={16}
                    strokeWidth={2}
                    className="text-muted-foreground invisible group-hover:visible group-data-[state=active]:visible"
                  />
                </span>
              </Button>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
      {openFiles.map((file) => (
        <TabsContent key={file.id} value={file.id} className={content()}>
          <div className={blocks()}>
            {file.blocks.map((block, idx) => (
              <Block
                key={idx}
                ref={(el) => {
                  blockRefs.current[idx] = el;
                }}
                kind={block.kind}
                vcsState={block.vcsState}
                lineno={idx + 1}
                content={block.content}
                isFocused={focusedBlockIndex === idx}
                index={idx}
                onFocus={setFocusedBlock}
              />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
