import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block, BlockProps } from "./Block";
import { Button } from "../../../../ui/Button";
import { GripVertical } from "lucide-react";
import { BlockKind } from "../../../../../stores/useEditorStore";
import { BlockDropdown } from "./BlockDropdown";
import { cn } from "tailwind-variants";

interface SortableBlockProps extends BlockProps {
  id: string;
  onDelete: () => void;
  onAdd: () => void;
  onConvert: (kind: BlockKind) => void;
}

export function SortableBlock({
  id,
  kind,
  vcsState,
  lineno,
  content,
  onDelete,
  onAdd,
  onConvert,
  onContentChange,
}: SortableBlockProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      setDropdownOpen(false);
      onAdd();
      return;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onKeyDown={handleKeyDown}
      className="relative w-full group/sortable"
    >
      {isDragging && (
        <div className=" bg-preview pointer-events-none h-2 opacity-50" />
      )}
      <div className={cn(isDragging && "opacity-0 h-0")}>
        <div className="absolute -left-15 top-0 h-full flex items-center gap-1 opacity-0 group-hover/sortable:opacity-100 transition-opacity">
          <Button
            size="sm"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} className="text-muted-foreground" />
          </Button>
          <BlockDropdown
            kind={kind}
            onConvert={onConvert}
            onAdd={onAdd}
            onDelete={onDelete}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
          />
        </div>
        <Block
          kind={kind}
          vcsState={vcsState}
          lineno={lineno}
          content={content}
          onContentChange={onContentChange}
          editorProps={{
            handleKeyDown: (_view: unknown, event: KeyboardEvent) => {
              // Enter 키 - 새 블록 추가
              if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                setDropdownOpen(false);
                onAdd();
                return true;
              }

              return false;
            },
          }}
        />
      </div>
    </div>
  );
}
