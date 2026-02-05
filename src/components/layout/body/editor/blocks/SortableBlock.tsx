import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block, BlockProps } from "./Block";
import { Button } from "../../../../ui/Button";
import { GripVertical } from "lucide-react";
import { BlockKind } from "../../../../../stores/useEditorStore";
import { BlockDropdown } from "./BlockDropdown";

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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-full group/sortable"
    >
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
        />
      </div>
      <Block
        kind={kind}
        vcsState={vcsState}
        lineno={lineno}
        content={content}
        onContentChange={onContentChange}
      />
    </div>
  );
}
