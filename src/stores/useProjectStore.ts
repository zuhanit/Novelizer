import { create } from "zustand";
import {
  commands,
  events,
  type Node,
  type FileMetadata,
} from "../types/rust/bindings";
import { open } from "@tauri-apps/plugin-dialog";

// FileNode는 Rust의 Node<FileMetadata>
type FileNode = Node<FileMetadata>;

// UI에서 사용할 TreeNode 타입
export interface TreeNode {
  id: string;
  label: string;
  children: TreeNode[];
}

interface ProjectState {
  projectPath: string | null;
  projectName: string | null;
  tree: Node<FileMetadata>[]; // 여러 루트 문서
  isLoaded: boolean;
}

interface ProjectActions {
  openProject: () => Promise<void>;
  createProject: () => Promise<void>;
  createDocument: (parent: FileNode, name: string) => Promise<void>;
  deleteDocument: (path: string) => Promise<void>;
  refreshTree: () => Promise<void>;
  buildPath: (docPath: string) => string[];
}

type ProjectStore = ProjectState & ProjectActions;

function findPathInFileNodes(
  nodes: FileNode[],
  targetPath: string,
  current: string[]
): string[] | null {
  for (const node of nodes) {
    const breadcrumbs = [...current, node.data.name];
    if (node.data.path === targetPath) return breadcrumbs;
    if (node.children.length > 0) {
      const found = findPathInFileNodes(node.children, targetPath, breadcrumbs);
      if (found) return found;
    }
  }
  return null;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projectPath: null,
  projectName: null,
  tree: [],
  isLoaded: false,

  openProject: async () => {
    const selected = await open({ directory: true, multiple: false });
    if (!selected) return;

    const path = selected as string;
    const result = await commands.openProject(path);
    if (result.status === "ok") {
      // 경로에서 프로젝트 이름 추출
      const projectName = path.split(/[/\\]/).pop() ?? "Untitled";
      console.log("Successfully loaded, ", result.data);

      set({
        projectPath: path,
        projectName,
        tree: result.data,
        isLoaded: true,
      });
    } else {
      throw new Error(result.error);
    }
  },

  createProject: async () => {
    const selected = await open({ directory: true, multiple: false });
    if (!selected) return;

    const path = selected as string;
    const result = await commands.createProject(path);
    if (result.status === "ok") {
      // 경로에서 프로젝트 이름 추출
      const projectName = path.split(/[/\\]/).pop() ?? "Untitled";

      set({
        projectPath: path,
        projectName,
        tree: result.data,
        isLoaded: true,
      });
    } else {
      throw new Error(result.error);
    }
  },

  createDocument: async (parent: FileNode, name: string) => {
    const result = await commands.createDocument(parent, name);
    if (result.status === "error") {
      console.error("Failed to create document:", result.error);
    }
  },

  deleteDocument: async (path: string) => {
    const result = await commands.deleteDocument(path);
    if (result.status === "error") {
      console.error("Failed to delete document:", result.error);
    }
  },

  refreshTree: async () => {
    const { projectPath } = get();
    if (!projectPath) return;

    const result = await commands.scanProjectDocuments();
    if (result.status === "ok") {
      set({ tree: result.data });
    }
  },

  buildPath: (docPath) => {
    const { projectName, tree } = get();
    const prefix = projectName ? [projectName] : [];
    const found = findPathInFileNodes(tree, docPath, prefix);
    return found ?? [];
  },
}));

// ProjectChanged 이벤트 리스너 — 백엔드에서 트리 변경 시 자동 갱신
events.projectChanged.listen(() => {
  useProjectStore.getState().refreshTree();
});
