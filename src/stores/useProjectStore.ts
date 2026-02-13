import { create } from "zustand";
import { commands, type Node, type FileMetadata } from "../types/rust/bindings";
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
  tree: Node<FileMetadata>[];  // 여러 루트 문서
  isLoaded: boolean;
}

interface ProjectActions {
  openProject: () => Promise<void>;
  createProject: () => Promise<void>;
  createDocument: (parent: FileNode, name: string) => Promise<void>;
  buildPath: (docId: string) => string[];
}

type ProjectStore = ProjectState & ProjectActions;

function findPathInFileNodes(
  nodes: FileNode[],
  targetId: string,
  current: string[]
): string[] | null {
  for (const node of nodes) {
    const path = [...current, node.data.name];
    if (node.data.path === targetId) return path;
    if (node.children.length > 0) {
      const found = findPathInFileNodes(node.children, targetId, path);
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
      // FileNode를 TreeNode로 변환
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
    const { projectPath } = get();
    if (!projectPath) return;

    const result = await commands.createDocument(parent, name);
    if (result.status === "ok") {
      // 프로젝트 다시 로드하여 트리 갱신
      const projectResult = await commands.openProject(projectPath);
      if (projectResult.status === "ok") {
        set({ tree: projectResult.data });
      }
    } else {
      throw new Error(result.error);
    }
  },

  buildPath: (docId) => {
    const { projectName, tree } = get();
    const prefix = projectName ? [projectName] : [];
    const found = findPathInFileNodes(tree, docId, prefix);
    return found ?? [];
  },
}));
