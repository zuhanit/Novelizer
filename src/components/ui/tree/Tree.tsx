import {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
  useCallback,
  forwardRef,
} from "react";
import { cn } from "tailwind-variants";
import { ChevronRight } from "lucide-react";
import TreeLineIcon from "../../../assets/tree/tree-line.svg";
import { Button } from "../Button";

interface TreeContextProps {
  selectedItem: any;
  selectItem: (item: any) => void;
  treeRef: React.RefObject<HTMLUListElement | null>;
  groupToggles: React.RefObject<Map<string, () => void>>;
}

const TreeContext = createContext<TreeContextProps | null>(null);

function useTree() {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error("useTree must be used in Tree.");
  }

  return context;
}

function getVisibleItems(root: HTMLElement): HTMLElement[] {
  const all = root.querySelectorAll<HTMLElement>('[role="treeitem"]');
  return Array.from(all).filter((el) => el.offsetParent !== null);
}

/**
 * Root container for the tree. Manages selection state and keyboard navigation.
 *
 * Follows the WAI-ARIA Tree View pattern:
 * - ArrowUp/Down: move focus between visible items
 * - ArrowRight: expand collapsed group or move to first child
 * - ArrowLeft: collapse expanded group or move to parent
 * - Home/End: move focus to first/last visible item
 * - Enter: select the focused item
 *
 * @example
 * ```tsx
 * <Tree label="File Explorer" onSelect={(item) => console.log(item)}>
 *   <TreeGroup data="docs">
 *     <TreeGroupTrigger>Documents</TreeGroupTrigger>
 *     <TreeGroupContent>
 *       <TreeItem data="readme">README.md</TreeItem>
 *     </TreeGroupContent>
 *   </TreeGroup>
 *   <TreeItem data="license">LICENSE</TreeItem>
 * </Tree>
 * ```
 */
export function Tree({
  label,
  className,
  onSelect,
  ...props
}: React.ComponentProps<"ul"> & {
  label: string;
  onSelect: (item: any) => void;
}) {
  const [selectedItem, setSelectedItem] = useState("");
  const treeRef = useRef<HTMLUListElement>(null);
  const groupToggles = useRef(new Map<string, () => void>());

  const selectItem = useCallback(
    (item: any) => {
      setSelectedItem(item);
      onSelect(item);
    },
    [onSelect]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent) => {
      if (e.target !== treeRef.current) return;
      const items = getVisibleItems(treeRef.current);
      const selected = items.find(
        (el) => el.dataset.value === String(selectedItem)
      );
      (selected ?? items[0])?.focus();
    },
    [selectedItem]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!treeRef.current) return;
      const items = getVisibleItems(treeRef.current);
      if (items.length === 0) return;

      const focused = document.activeElement as HTMLElement;
      const idx = items.indexOf(focused);
      if (idx === -1) return;

      let handled = true;

      switch (e.key) {
        case "ArrowDown":
          items[Math.min(idx + 1, items.length - 1)]?.focus();
          break;

        case "ArrowUp":
          items[Math.max(idx - 1, 0)]?.focus();
          break;

        case "ArrowRight": {
          const expanded = focused.getAttribute("aria-expanded");
          if (expanded === "false") {
            groupToggles.current.get(focused.dataset.value!)?.();
          } else if (expanded === "true") {
            items[idx + 1]?.focus();
          }
          break;
        }

        case "ArrowLeft": {
          const expanded = focused.getAttribute("aria-expanded");
          if (expanded === "true") {
            groupToggles.current.get(focused.dataset.value!)?.();
          } else {
            const parent = focused.parentElement?.closest<HTMLElement>(
              'li[role="treeitem"]'
            );
            if (parent && items.includes(parent)) parent.focus();
          }
          break;
        }

        case "Home":
          items[0]?.focus();
          break;

        case "End":
          items[items.length - 1]?.focus();
          break;

        case "Enter":
          if (focused.dataset.value !== undefined) {
            selectItem(focused.dataset.value);
          }
          break;

        default:
          handled = false;
      }

      if (handled) e.preventDefault();
    },
    [selectItem]
  );

  return (
    <TreeContext.Provider
      value={{ selectedItem, selectItem, treeRef, groupToggles }}
    >
      <ul
        ref={treeRef}
        tabIndex={0}
        className={cn(
          "list-none p-0 m-0 outline-none",
          className
        )}
        role="tree"
        aria-label={label}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </TreeContext.Provider>
  );
}

/** Renders vertical tree-line SVGs to visually indent items by depth. */
function TreeIndent({ depth }: { depth: number }) {
  if (depth === 0) return null;

  return (
    <>
      {Array.from({ length: depth }, (_, i) => (
        <img key={i} src={TreeLineIcon} className="w-4 h-6 shrink-0" alt="" />
      ))}
    </>
  );
}

/** Leaf node in the tree. Clicking or pressing Enter selects it. */
export const TreeItem = forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & { data: unknown }
>(function TreeItem({ data, className, children, ...props }, ref) {
  const { selectedItem, selectItem } = useTree();
  const group = useContext(TreeGroupContext);
  const depth = group?.depth ?? 0;
  const isSelected = selectedItem === data;

  return (
    <li
      ref={ref}
      role="treeitem"
      tabIndex={-1}
      data-value={String(data)}
      aria-selected={isSelected}
      className={cn("outline-none", className)}
      {...props}
    >
      <div
        className={cn(
          "flex gap-1 items-center h-6 select-none hover:bg-ui-selection-active rounded-sm duration-150 transition-colors",
          isSelected && "bg-ui-selection-active",
          "focus:ring-1 focus:ring-ui-foreground"
        )}
        onClick={() => selectItem(data)}
      >
        <TreeIndent depth={depth} />
        <span className="w-4 shrink-0" />
        {children}
      </div>
    </li>
  );
});

interface TreeGroupContextProps {
  data: any;
  depth: number;
  isExpanded: boolean;
  toggleGroup: () => void;
}

const TreeGroupContext = createContext<TreeGroupContextProps | null>(null);

function useTreeGroup() {
  const context = useContext(TreeGroupContext);
  if (!context) {
    throw new Error("useTreeGroup must be used in TreeGroup.");
  }

  return context;
}

/** Expandable/collapsible branch node. Contains a `TreeGroupTrigger` and `TreeGroupContent`. */
export const TreeGroup = forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li"> & { data: unknown }
>(function TreeGroup({ data, className, ...props }, ref) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { selectedItem, groupToggles } = useTree();
  const parentGroup = useContext(TreeGroupContext);
  const depth = (parentGroup?.depth ?? 0) + 1;
  const toggleGroup = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const isSelected = selectedItem === data;
  const key = String(data);

  useEffect(() => {
    groupToggles.current.set(key, toggleGroup);
    return () => {
      groupToggles.current.delete(key);
    };
  }, [key, toggleGroup, groupToggles]);

  return (
    <TreeGroupContext.Provider value={{ data, depth, isExpanded, toggleGroup }}>
      <li
        ref={ref}
        tabIndex={-1}
        data-value={key}
        className={cn(
          "outline-none aria-expanded:[&>ul]:block aria-[expanded=false]:[&>ul]:hidden aria-selected:[&>div]:bg-ui-selection-active",
          "focus:[&>div]:ring-1 focus:[&>div]:ring-ui-foreground",
          className
        )}
        role="treeitem"
        aria-expanded={isExpanded}
        aria-selected={isSelected}
        {...props}
      />
    </TreeGroupContext.Provider>
  );
});

/** Clickable header row for a `TreeGroup`. Chevron toggles expand/collapse, label click selects. */
export function TreeGroupTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { selectItem } = useTree();
  const { data, depth, isExpanded, toggleGroup } = useTreeGroup();

  return (
    <div
      className={cn(
        "flex gap-1 items-center h-6 hover:bg-ui-selection-active rounded-sm duration-150 transition-colors",
        className
      )}
      onClick={() => selectItem(data)}
      {...props}
    >
      <TreeIndent depth={depth - 1} />
      <Button className="p-0" onClick={() => toggleGroup()}>
        <ChevronRight
          size={16}
          className={cn(
            "transition-transform duration-150",
            isExpanded && "rotate-90"
          )}
        />
      </Button>
      {children}
    </div>
  );
}

/** Wrapper for child items of a `TreeGroup`. Visibility is controlled by the parent's `aria-expanded`. */
export function TreeGroupContent({ ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className="aria-expanded:block aria-[expanded=false]:hidden"
      role="group"
      {...props}
    />
  );
}
