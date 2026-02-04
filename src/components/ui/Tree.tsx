import { useState, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { ChevronRight } from "lucide-react";

import TreeBranchIcon from "../../assets/tree/tree-branch.svg";
import TreeCornerIcon from "../../assets/tree/tree-corner.svg";
import TreeLineIcon from "../../assets/tree/tree-line.svg";

export const treeVariants = tv({
  slots: {
    root: "list-none p-0 m-0",
    item: "px-2.5 h-6 flex items-center gap-1 cursor-pointer hover:bg-ui-selection-normal rounded-sm transition-colors",
    connector: "w-4 shrink-0",
    expandIcon: "w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-150",
    icon: "w-4 h-4 shrink-0",
    label: "text-xs text-muted-foreground",
    group: "list-none p-0 m-0",
  },
});

export interface TreeNode {
  label: string;
  icon?: ReactNode;
  defaultExpanded?: boolean;
  onSelect?: () => void;
  children?: TreeNode[];
}

export type SortableTreeNode = TreeNode & { id: string; children?: SortableTreeNode[] };

export interface TreeProps<T> {
  items: T[];
  label: string;
}

export function Tree({ items, label }: TreeProps<TreeNode>) {
  const { root } = treeVariants();

  return (
    <ul role="tree" aria-label={label} className={root()}>
      {items.map((node, index) => (
        <TreeItem
          key={index}
          node={node}
          depth={1}
          isLast={index === items.length - 1}
        />
      ))}
    </ul>
  );
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  isLast: boolean;
}

export function TreeItem({ node, depth, isLast }: TreeItemProps) {
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
    node.onSelect?.();
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
      </li>

      {isFolder && isExpanded && (
        <ul role="group" className={group()}>
          {node.children!.map((child, index) => (
            <TreeItem
              key={index}
              node={child}
              depth={depth + 1}
              isLast={index === node.children!.length - 1}
            />
          ))}
        </ul>
      )}
    </>
  );
}
