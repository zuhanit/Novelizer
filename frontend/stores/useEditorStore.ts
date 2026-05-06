import { create } from "zustand";
import { commands, events, type BlockKind, type Document, type VCSState } from "../types/rust/bindings";

interface EditorState {
  openFiles: Document[];
  filePaths: Record<string, string>; // document id → filesystem path
  activeTab: string | null;
  focusedBlockIndex: number | null;
  openFileByPath: (path: string) => Promise<void>;
  closeDocument: (fileId: string) => void;
  setActiveTab: (fileId: string) => void;
  addBlock: (fileId: string, kind: BlockKind, index?: number) => Promise<void>;
  deleteBlock: (fileId: string, blockId: string) => Promise<void>;
  reorderBlocks: (fileId: string, startIndex: number, endIndex: number) => Promise<void>;
  updateBlockContent: (
    fileId: string,
    blockId: string,
    content: string
  ) => void;
  changeBlockKind: (fileId: string, blockId: string, kind: BlockKind) => Promise<void>;
  setFocusedBlock: (index: number) => void;
  getActiveFile: () => Document | null;
  getFilePath: (fileId: string) => string | undefined;
}

const pendingSaves = new Map<string, ReturnType<typeof setTimeout>>();

function replaceFile(openFiles: Document[], updated: Document): Document[] {
  return openFiles.map((f) => (f.id === updated.id ? updated : f));
}

function cancelPendingSave(fileId: string) {
  const timeout = pendingSaves.get(fileId);
  if (timeout) {
    clearTimeout(timeout);
    pendingSaves.delete(fileId);
  }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  filePaths: {},
  activeTab: null,
  focusedBlockIndex: null,

  openFileByPath: async (path: string) => {
    const { filePaths } = get();

    // path가 이미 열려있는지 확인
    const existingId = Object.entries(filePaths).find(([, p]) => p === path)?.[0];
    if (existingId) {
      set({ activeTab: existingId });
      return;
    }

    const result = await commands.openDocument(path);
    if (result.status === "ok") {
      const doc = result.data;

      set({
        openFiles: [...get().openFiles, doc],
        filePaths: { ...get().filePaths, [doc.id]: path },
        activeTab: doc.id,
      });
    } else {
      console.error("Failed to load document:", result.error);
    }
  },

  closeDocument: (fileId) => {
    const { openFiles, activeTab, filePaths } = get();
    cancelPendingSave(fileId);
    const fileIndex = openFiles.findIndex((f) => f.id === fileId);
    const newOpenFiles = openFiles.filter((f) => f.id !== fileId);

    let newActiveTab = activeTab;

    if (activeTab === fileId && newOpenFiles.length > 0) {
      const newActiveIndex = Math.min(fileIndex, newOpenFiles.length - 1);
      newActiveTab = newOpenFiles[newActiveIndex].id;
    } else if (newOpenFiles.length === 0) {
      newActiveTab = null;
    }

    const { [fileId]: _, ...remainingPaths } = filePaths;

    set({
      openFiles: newOpenFiles,
      filePaths: remainingPaths,
      activeTab: newActiveTab,
    });
  },

  setActiveTab: (fileId) => {
    set({ activeTab: fileId });
  },

  addBlock: async (fileId, kind, index) => {
    const doc = get().openFiles.find((f) => f.id === fileId);
    const path = get().filePaths[fileId];
    if (!doc || !path) return;

    cancelPendingSave(fileId);
    const result = await commands.addBlock(doc, path, kind, index ?? null);
    if (result.status === "ok") {
      set({ openFiles: replaceFile(get().openFiles, result.data) });
    } else {
      console.error("Failed to add block:", result.error);
    }
  },

  deleteBlock: async (fileId, blockId) => {
    const doc = get().openFiles.find((f) => f.id === fileId);
    const path = get().filePaths[fileId];
    if (!doc || !path) return;

    cancelPendingSave(fileId);
    const result = await commands.deleteBlock(doc, path, blockId);
    if (result.status === "ok") {
      set({ openFiles: replaceFile(get().openFiles, result.data) });
    } else {
      console.error("Failed to delete block:", result.error);
    }
  },

  reorderBlocks: async (fileId, startIndex, endIndex) => {
    const doc = get().openFiles.find((f) => f.id === fileId);
    const path = get().filePaths[fileId];
    if (!doc || !path) return;

    cancelPendingSave(fileId);
    const result = await commands.reorderBlocks(doc, path, startIndex, endIndex);
    if (result.status === "ok") {
      set({ openFiles: replaceFile(get().openFiles, result.data) });
    } else {
      console.error("Failed to reorder blocks:", result.error);
    }
  },

  updateBlockContent: (fileId, blockId, content) => {
    const { openFiles } = get();

    // 낙관적 로컬 업데이트
    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlocks = file.blocks.map((block) => {
        if (block.id !== blockId) return block;
        const newVcsState: VCSState =
          block.vcs_state === "added" ? "added" : "modified";
        return { ...block, content, vcs_state: newVcsState };
      });

      return { ...file, blocks: newBlocks };
    });

    set({ openFiles: newOpenFiles });

    // 파일별 debounce로 백엔드 저장
    cancelPendingSave(fileId);
    const timeout = setTimeout(async () => {
      pendingSaves.delete(fileId);
      const doc = get().openFiles.find((f) => f.id === fileId);
      const path = get().filePaths[fileId];
      if (!doc || !path) return;

      const result = await commands.updateBlockContent(doc, path, blockId, content);
      if (result.status === "ok") {
        set({ openFiles: replaceFile(get().openFiles, result.data) });
      } else {
        console.error("Failed to update block content:", result.error);
      }
    }, 1000);
    pendingSaves.set(fileId, timeout);
  },

  changeBlockKind: async (fileId, blockId, kind) => {
    const doc = get().openFiles.find((f) => f.id === fileId);
    const path = get().filePaths[fileId];
    if (!doc || !path) return;

    cancelPendingSave(fileId);
    const result = await commands.changeBlockKind(doc, path, blockId, kind);
    if (result.status === "ok") {
      set({ openFiles: replaceFile(get().openFiles, result.data) });
    } else {
      console.error("Failed to change block kind:", result.error);
    }
  },

  setFocusedBlock: (index) => {
    set({ focusedBlockIndex: index });
  },

  getActiveFile: () => {
    const { openFiles, activeTab } = get();
    return openFiles.find((f) => f.id === activeTab) ?? null;
  },

  getFilePath: (fileId) => {
    return get().filePaths[fileId];
  },
}));

// DocumentChanged 이벤트 리스너
events.documentChanged.listen((e) => {
  const { document, kind } = e.payload;
  if (kind === "Deleted") {
    useEditorStore.getState().closeDocument(document.id);
  } else if (kind === "Renamed") {
    const { openFiles } = useEditorStore.getState();
    useEditorStore.setState({
      openFiles: replaceFile(openFiles, document),
    });
  } else if (typeof kind === "object" && "Moved" in kind) {
    const { old_path, new_path } = kind.Moved;
    const { filePaths } = useEditorStore.getState();
    // old_path로 열려있던 문서의 filePaths를 new_path로 갱신
    const entryId = Object.entries(filePaths).find(([, p]) => p === old_path)?.[0];
    if (entryId) {
      useEditorStore.setState({
        filePaths: { ...filePaths, [entryId]: new_path },
      });
    }
  }
});
