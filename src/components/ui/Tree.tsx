import { useState, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { ChevronRight } from "lucide-react";

import TreeBranchIcon from "../../assets/tree/tree-branch.svg";
import TreeCornerIcon from "../../assets/tree/tree-corner.svg";
import TreeLineIcon from "../../assets/tree/tree-line.svg";

export const treeVariants = tv({
  slots: {
    root: "list-none p-0 m-0",
    item: "group px-2.5 h-6 flex items-center gap-1 cursor-pointer hover:bg-ui-selection-normal rounded-sm transition-colors",
    connector: "w-4 shrink-0",
    expandIcon:
      "w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-150",
    icon: "w-4 h-4 shrink-0",
    label: "text-xs text-muted-foreground",
    group: "list-none p-0 m-0",
  },
});

/**
 * TreeNode interface - Purely structural, no business logic
 * @template T - The type of data stored in each node
 */
export interface TreeNode<T> {
  /** Display label for the node */
  label: string;
  /** Optional icon to display before the label */
  icon?: ReactNode;
  /** Whether the node should be expanded by default */
  defaultExpanded?: boolean;
  /** Child nodes */
  children?: TreeNode<T>[];
  /** Arbitrary data payload */
  data: T;
}

/**
 * SortableTreeNode extends TreeNode with an ID for drag-and-drop operations
 */
export type SortableTreeNode<T> = TreeNode<T> & {
  id: string;
  children?: SortableTreeNode<T>[];
};

/**
 * TreeProps - Configuration for Tree component
 * @template T - The type of data stored in each node
 */
export interface TreeProps<T> {
  /** Array of root-level tree nodes */
  items: TreeNode<T>[];
  /** Accessibility label for the tree */
  label: string;
  /** Optional callback when a node is clicked */
  onNodeClick?: (node: TreeNode<T>) => void;
  /** Optional render function for custom actions per node */
  renderActions?: (node: TreeNode<T>) => ReactNode;
}

/**
 * Tree component - Renders a hierarchical tree structure
 *
 * @example
 * ```tsx
 * const items = [
 *   { label: "Folder", data: {...}, children: [
 *     { label: "File", data: {...} }
 *   ]}
 * ];
 *
 * <Tree
 *   items={items}
 *   label="File Explorer"
 *   onNodeClick={(node) => console.log(node.data)}
 *   renderActions={(node) => <Button>+</Button>}
 * />
 * ```
 */
export function Tree<T>({ items, label, onNodeClick, renderActions }: TreeProps<T>) {
  const { root } = treeVariants();

  return (
    <ul role="tree" aria-label={label} className={root()}>
      {items.map((node, index) => (
        <TreeItem
          key={index}
          node={node}
          depth={1}
          isLast={index === items.length - 1}
          onNodeClick={onNodeClick}
          renderActions={renderActions}
        />
      ))}
    </ul>
  );
}

interface TreeItemProps<T> {
  node: TreeNode<T>;
  depth: number;
  isLast: boolean;
  onNodeClick?: (node: TreeNode<T>) => void;
  renderActions?: (node: TreeNode<T>) => ReactNode;
}

export function TreeItem<T>({
  node,
  depth,
  isLast,
  onNodeClick,
  renderActions,
}: TreeItemProps<T>) {
  const [isExpanded, setIsExpanded] = useState(node.defaultExpanded ?? false);
  const {
    item,
    connector,
    expandIcon,
    icon: iconClass,
    label: labelClass,
    group,
  } = treeVariants();

  const isFolder = Boolean(node.children?.length);

  const handleClick = () => {
    if (isFolder) {
      setIsExpanded(!isExpanded);
    }
    onNodeClick?.(node);
  };

  return (
    <>
      <li
        role="treeitem"
        aria-level={depth}
        aria-expanded={isFolder ? isExpanded : undefined}
        className={item()}
        onClick={handleClick}
      >
        {depth > 1 && (
          <>
            {Array.from({ length: depth - 2 }, (_, index) => (
              <img
                key={index}
                src={TreeLineIcon}
                className={connector()}
                alt=""
              />
            ))}
            <img
              src={
                isLast && !(isFolder && isExpanded)
                  ? TreeCornerIcon
                  : TreeBranchIcon
              }
              className={connector()}
              alt=""
            />
          </>
        )}

        {isFolder && (
          <span className={`${expandIcon()} ${isExpanded ? "rotate-90" : ""}`}>
            <ChevronRight size={16} />
          </span>
        )}

        {node.icon && <span className={iconClass()}>{node.icon}</span>}

        <span className={labelClass()}>{node.label}</span>

        {renderActions && renderActions(node)}
      </li>

      {isFolder && isExpanded && (
        <ul role="group" className={group()}>
          {node.children!.map((child, index) => (
            <TreeItem
              key={index}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
              onNodeClick={onNodeClick}
              renderActions={renderActions}
            />
          ))}
        </ul>
      )}
    </>
  );
}
