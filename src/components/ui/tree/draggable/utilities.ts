import { UniqueIdentifier } from "@dnd-kit/core";
import { DraggableTreeNode } from "./DraggableTree";

export type DropPosition = "before" | "after" | "into";

export function findNode<T>(
  nodes: DraggableTreeNode<T>[],
  id: string | number
): DraggableTreeNode<T> | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const children = node.children ?? [];
    if (children.length) {
      const found = findNode(children, id);
      if (found) return found;
    }
  }
  return null;
}

export function treeRemove<T>(
  tree: DraggableTreeNode<T>[],
  id: UniqueIdentifier
): DraggableTreeNode<T>[] {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => {
      const children = node.children ?? [];
      return children.length
        ? { ...node, children: treeRemove(children, id) }
        : node;
    });
}

export function isDescendant<T>(
  node: DraggableTreeNode<T>,
  targetId: UniqueIdentifier
): boolean {
  for (const child of node.children ?? []) {
    if (child.id === targetId) return true;
    if (isDescendant(child, targetId)) return true;
  }
  return false;
}

function treeInsert<T>(
  tree: DraggableTreeNode<T>[],
  fromNode: DraggableTreeNode<T>,
  toId: UniqueIdentifier
): DraggableTreeNode<T>[] {
  return tree.map((node) => {
    if (node.id === toId) {
      return { ...node, children: [...(node.children ?? []), fromNode] };
    }
    const children = node.children ?? [];
    if (children.length) {
      return { ...node, children: treeInsert(children, fromNode, toId) };
    }
    return node;
  });
}

function treeInsertBeside<T>(
  tree: DraggableTreeNode<T>[],
  fromNode: DraggableTreeNode<T>,
  toId: UniqueIdentifier,
  position: "before" | "after"
): DraggableTreeNode<T>[] {
  const result: DraggableTreeNode<T>[] = [];
  for (const node of tree) {
    if (node.id === toId) {
      if (position === "before") {
        result.push(fromNode, node);
      } else {
        result.push(node, fromNode);
      }
    } else {
      const children = node.children ?? [];
      if (children.length) {
        result.push({
          ...node,
          children: treeInsertBeside(children, fromNode, toId, position),
        });
      } else {
        result.push(node);
      }
    }
  }
  return result;
}

export function treeInsertRoot<T>(
  tree: DraggableTreeNode<T>[],
  fromId: UniqueIdentifier
): DraggableTreeNode<T>[] {
  const fromNode = findNode(tree, fromId);
  if (!fromNode) return tree;

  const removed = treeRemove(tree, fromId);
  return [...removed, fromNode];
}

export function treeMove<T>(
  tree: DraggableTreeNode<T>[],
  fromId: UniqueIdentifier,
  toId: UniqueIdentifier,
  position: DropPosition
): DraggableTreeNode<T>[] {
  if (fromId === toId) return tree;

  const fromNode = findNode(tree, fromId);
  if (!fromNode) return tree;
  if (isDescendant(fromNode, toId)) return tree;

  const removed = treeRemove(tree, fromId);

  if (position === "into") {
    return treeInsert(removed, fromNode, toId);
  }
  return treeInsertBeside(removed, fromNode, toId, position);
}
