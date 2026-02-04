import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight } from "lucide-react";

import { treeVariants, type TreeProps, type SortableTreeNode } from "./Tree";
import TreeBranchIcon from "../../assets/tree/tree-branch.svg";
import TreeCornerIcon from "../../assets/tree/tree-corner.svg";
import TreeLineIcon from "../../assets/tree/tree-line.svg";
import { Button } from "./Button";

// --- flattenTree ---

interface FlatNode extends SortableTreeNode {
  depth: number;
  parentId: string | null;
  isLast: boolean;
}

function flattenTree(
  items: SortableTreeNode[],
  collapsedIds: Set<string>,
  depth = 1,
  parentId: string | null = null
): FlatNode[] {
  return items.flatMap((node, index) => {
    const isLast = index === items.length - 1;
    const flat: FlatNode = { ...node, depth, parentId, isLast };
    const isFolder = Boolean(node.children?.length);
    const isCollapsed = collapsedIds.has(node.id);

    if (isFolder && !isCollapsed && node.children) {
      return [
        flat,
        ...flattenTree(node.children, collapsedIds, depth + 1, node.id),
      ];
    }
    return [flat];
  });
}

// --- SortableTree ---

export function SortableTree({ items, label }: TreeProps<SortableTreeNode>) {
  const [treeItems] = useState(items);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const flatItems = useMemo(
    () => flattenTree(treeItems, collapsedIds),
    [treeItems, collapsedIds]
  );

  const sortedIds = useMemo(() => flatItems.map((n) => n.id), [flatItems]);

  const activeItem = activeId ? flatItems.find((n) => n.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    // TODO: 순서 변경 로직
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleToggle = (id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const { root } = treeVariants();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        <ul aria-label={label} className={root()}>
          {flatItems.map((node) => (
            <SortableTreeItem
              key={node.id}
              node={node}
              isCollapsed={collapsedIds.has(node.id)}
              onToggle={handleToggle}
            />
          ))}
        </ul>
      </SortableContext>
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {activeItem ? <DragOverlayItem node={activeItem} /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

// --- SortableTreeItem ---

interface SortableTreeItemProps {
  node: FlatNode;
  isCollapsed: boolean;
  onToggle: (id: string) => void;
}

function SortableTreeItem({
  node,
  isCollapsed,
  onToggle,
}: SortableTreeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const {
    item,
    connector,
    expandIcon,
    icon: iconClass,
    label: labelClass,
  } = treeVariants();

  const isFolder = Boolean(node.children?.length);

  const handleClick = () => {
    node.onSelect?.();
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  return (
    <li
      ref={setNodeRef}
      aria-level={node.depth}
      aria-expanded={isFolder ? undefined : undefined}
      className={item()}
      style={style}
      data-dragging={isDragging || undefined}
      onClick={handleClick}
      {...attributes}
      {...listeners}
      role="treeitem"
    >
      {node.depth > 1 && (
        <>
          {Array.from({ length: node.depth - 2 }, (_, index) => (
            <img
              key={index}
              src={TreeLineIcon}
              className={connector()}
              alt=""
            />
          ))}
          <img
            src={node.isLast ? TreeCornerIcon : TreeBranchIcon}
            className={connector()}
            alt=""
          />
        </>
      )}

      {isFolder && (
        <Button
          size="sm"
          className={`${expandIcon()} ${isCollapsed ? "" : "rotate-90"}`}
          onClick={handleToggle}
        >
          <ChevronRight size={16} />
        </Button>
      )}

      {node.icon && <span className={iconClass()}>{node.icon}</span>}

      <span className={labelClass()}>{node.label}</span>
    </li>
  );
}

// --- DragOverlayItem ---

function DragOverlayItem({ node }: { node: FlatNode }) {
  const { item, icon: iconClass, label: labelClass } = treeVariants();

  return (
    <div
      className={`${item()} bg-ui-background shadow-lg border border-ui-border opacity-90`}
    >
      {node.icon && <span className={iconClass()}>{node.icon}</span>}
      <span className={labelClass()}>{node.label}</span>
    </div>
  );
}
