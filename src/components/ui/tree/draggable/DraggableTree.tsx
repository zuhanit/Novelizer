import { useCallback, useState } from "react";
import type { Modifier } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  useDroppable,
  useDraggable,
  pointerWithin,
} from "@dnd-kit/core";

import {
  Tree,
  TreeGroup,
  TreeGroupContent,
  TreeGroupTrigger,
  TreeItem,
} from "../Tree";
import { cn, tv } from "tailwind-variants";
import { findNode, treeMove, treeInsertRoot } from "./utilities";
import { File } from "lucide-react";

const TREE_ROOT_ID = "__tree_root__";

const snapTopLeftToCursor: Modifier = ({
  activatorEvent,
  draggingNodeRect,
  transform,
}) => {
  if (activatorEvent instanceof MouseEvent && draggingNodeRect) {
    return {
      ...transform,
      x: transform.x + (activatorEvent.clientX - draggingNodeRect.left),
      y: transform.y + (activatorEvent.clientY - draggingNodeRect.top),
    };
  }
  return transform;
};

export type DraggableTreeNode<T = unknown> = {
  id: string;
  label: string;
  data: T;
  children?: DraggableTreeNode<T>[];
};

export type DraggableTreeRenderComponentType<T> = React.ComponentType<{
  node: DraggableTreeNode<T>;
}>;

type DraggableTreeProps<T> = {
  label: string;
  items: DraggableTreeNode<T>[];
  onSelect: (data: T) => void;
  TriggerContent: DraggableTreeRenderComponentType<T>;
  LeafContent: DraggableTreeRenderComponentType<T>;
  ItemWrapper?: React.ComponentType<{
    node: DraggableTreeNode<T>;
    children: React.ReactNode;
  }>;
};

function DroppableRoot({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: TREE_ROOT_ID });
  return <div ref={setNodeRef}>{children}</div>;
}

/**
 * Tree that supports drag and drop operations.
 *
 * Each item is both draggable and droppable via `useDraggable` + `useDroppable`.
 * Dropping an item onto another inserts it as a child. Dropping onto the root
 * area moves it to the top level.
 */
export function DraggableTree<T>({
  label,
  onSelect,
  items,
  TriggerContent,
  LeafContent,
  ItemWrapper,
}: DraggableTreeProps<T>) {
  const [treeItems, setTreeItems] = useState(items);
  const [activeItem, setActiveItem] = useState<DraggableTreeNode<T> | null>(
    null
  );
  const [overItem, setOverItem] = useState<DraggableTreeNode<T> | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (e: DragStartEvent) => {
    setActiveItem(findNode(treeItems, e.active.id));
  };

  const handleDragOver = (e: DragOverEvent) => {
    if (e.over && e.over.id !== e.active.id) {
      setOverItem(findNode(treeItems, e.over.id));
    } else {
      setOverItem(null);
    }
  };

  const handleSelect = useCallback(
    (id: unknown) => {
      const node = findNode(treeItems, id as string);
      if (node) onSelect(node.data);
    },
    [treeItems, onSelect]
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    setActiveItem(null);
    setOverItem(null);

    if (!over || active.id === over.id) return;

    if (over.id === TREE_ROOT_ID) {
      setTreeItems((items) => treeInsertRoot(items, active.id));
    } else {
      setTreeItems((items) => treeMove(items, active.id, over.id, "into"));
    }
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <DroppableRoot>
        <Tree label={label} onSelect={handleSelect}>
          {treeItems.map((item) => (
            <DraggableTreeItem
              key={item.id}
              node={item}
              TriggerContent={TriggerContent}
              LeafContent={LeafContent}
              ItemWrapper={ItemWrapper}
            />
          ))}
        </Tree>
      </DroppableRoot>
      <DragOverlay dropAnimation={null} modifiers={[snapTopLeftToCursor]}>
        {activeItem ? (
          <DraggableTreeOverlay active={activeItem} over={overItem} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

const draggableTreeItemVariants = tv({
  base: "",
  variants: {
    state: {
      dragging: "bg-editor-selection-active",
      dropping: "bg-editor-selection-inactive",
    },
  },
});

function useDragDrop(id: string) {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({ id });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id });

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDraggableRef(node);
      setDroppableRef(node);
    },
    [setDraggableRef, setDroppableRef]
  );

  return { attributes, listeners, setNodeRef, isDragging, isOver };
}

function DraggableTreeItem<T>({
  node,
  TriggerContent,
  LeafContent,
  ItemWrapper,
}: {
  node: DraggableTreeNode<T>;
  TriggerContent: DraggableTreeProps<T>["TriggerContent"];
  LeafContent: DraggableTreeProps<T>["LeafContent"];
  ItemWrapper?: DraggableTreeProps<T>["ItemWrapper"];
}) {
  const Wrapper = ItemWrapper ?? (({ children }: { children: React.ReactNode }) => <>{children}</>);
  const { attributes, listeners, setNodeRef, isDragging, isOver } = useDragDrop(
    node.id
  );
  const style = draggableTreeItemVariants({
    state: isDragging ? "dragging" : isOver ? "dropping" : undefined,
  });

  const children = node.children ?? [];

  if (children.length !== 0) {
    return (
      <TreeGroup
        ref={setNodeRef}
        data={node.id}
        className={style}
        {...attributes}
        {...listeners}
      >
        <Wrapper node={node}>
          <TreeGroupTrigger>
            <TriggerContent node={node} />
          </TreeGroupTrigger>
        </Wrapper>
        <TreeGroupContent>
          {children.map((child) => (
            <DraggableTreeItem
              key={child.id}
              node={child}
              TriggerContent={TriggerContent}
              LeafContent={LeafContent}
              ItemWrapper={ItemWrapper}
            />
          ))}
        </TreeGroupContent>
      </TreeGroup>
    );
  }

  return (
    <TreeItem
      ref={setNodeRef}
      data={node.id}
      className={style}
      {...attributes}
      {...listeners}
    >
      <Wrapper node={node}>
        <LeafContent node={node} />
      </Wrapper>
    </TreeItem>
  );
}

function DraggableTreeOverlay({
  active,
  over,
}: {
  active: DraggableTreeNode;
  over: DraggableTreeNode | null;
}) {
  return (
    <div
      className={cn(
        "p-1 rounded-sm bg-ui-panel-background shadow-popup inline-flex flex-col select-none"
      )}
    >
      <div className="flex gap-1 items-center">
        <File size={16} className="text-muted-foreground" />
        <strong className="text-foreground whitespace-nowrap">
          {active.label}
        </strong>
      </div>
      {over && (
        <p className="whitespace-nowrap text-muted-foreground">
          Move into "{over.label}"
        </p>
      )}
    </div>
  );
}
