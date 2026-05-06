import { useState, useRef, useEffect } from "react";
import { tv } from "tailwind-variants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../ui/Tabs";
import { Button } from "../../../ui/Button";
import { X } from "lucide-react";
import { useEditorStore } from "../../../../stores/useEditorStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlock } from "./blocks/SortableBlock";
import { Block } from "./blocks/Block";

const editorVariants = tv({
  slots: {
    base: "flex flex-col bg-ui-background w-full h-full",
    content: "flex-1 w-full overflow-y-auto",
    blocks: "flex flex-col items-center w-175 mx-auto",
    empty:
      "flex-1 flex items-center justify-center text-muted-foreground text-sm",
    blank:
      "w-full flex items-center justify-center text-muted-foreground opacity-0 hover:opacity-100 transition-opacity py-8 hover:bg-transparent",
  },
});

export function Editor() {
  const { base, content, blocks, empty, blank } = editorVariants();
  const [activeId, setActiveId] = useState<string | null>(null);
  const {
    openFiles,
    activeTab,
    closeDocument: closeFile,
    setActiveTab,
    addBlock,
    deleteBlock,
    reorderBlocks,
    changeBlockKind,
    updateBlockContent,
    focusedBlockIndex,
    setFocusedBlock,
  } = useEditorStore();
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleClose = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    closeFile(fileId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent, fileId: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeBlockId = active.id.toString();
      const overBlockId = over.id.toString();

      const file = openFiles.find((f) => f.id === fileId);
      if (!file) return;

      const oldIndex = file.blocks.findIndex((b) => b.id === activeBlockId);
      const newIndex = file.blocks.findIndex((b) => b.id === overBlockId);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBlocks(fileId, oldIndex, newIndex);
      }
    }

    setActiveId(null);
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
          <TabsTrigger key={file.id} value={file.id}>
              <span
                className="group-data-[state=active]:font-semibold after:block after:h-0 after:overflow-hidden after:invisible after:font-semibold after:content-[attr(data-text)]"
                data-text={file.name}
              >
                {file.name}
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
          </TabsTrigger>
        ))}
      </TabsList>
      {openFiles.map((file) => {
        const blockIds = file.blocks.map((block) => block.id);

        return (
          <TabsContent key={file.id} value={file.id} className={content()}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={(event) => handleDragEnd(event, file.id)}
            >
              <SortableContext
                items={blockIds}
                strategy={verticalListSortingStrategy}
              >
                <div className={blocks()}>
                  {file.blocks.map((block, idx) => (
                    <SortableBlock
                      key={block.id}
                      ref={(el) => {
                        blockRefs.current[idx] = el;
                      }}
                      id={block.id}
                      kind={block.kind}
                      vcsState={block.vcs_state}
                      lineno={idx + 1}
                      content={block.content}
                      isFocused={focusedBlockIndex === idx}
                      index={idx}
                      onFocus={setFocusedBlock}
                      onDelete={() => deleteBlock(file.id, block.id)}
                      onAdd={() => addBlock(file.id, "content", idx + 1)}
                      onConvert={(kind) =>
                        changeBlockKind(file.id, block.id, kind)
                      }
                      onContentChange={(newContent) =>
                        updateBlockContent(file.id, block.id, newContent)
                      }
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeId
                  ? (() => {
                      const block = file.blocks.find((b) => b.id === activeId);
                      const idx = file.blocks.findIndex(
                        (b) => b.id === activeId
                      );
                      if (!block) return null;
                      return (
                        <div className="w-175 opacity-50">
                          <Block
                            kind={block.kind}
                            vcsState={block.vcs_state}
                            lineno={idx + 1}
                            content={block.content}
                          />
                        </div>
                      );
                    })()
                  : null}
              </DragOverlay>
            </DndContext>
            <Button
              className={blank()}
              onClick={() => addBlock(file.id, "content")}
            >
              블록을 추가하려면 클릭하세요.
            </Button>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
