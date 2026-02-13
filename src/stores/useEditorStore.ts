import { create } from "zustand";
import { commands, Block as RustBlock, Document } from "../types/rust/bindings";
import { useProjectStore } from "./useProjectStore";

export type BlockKind = "content" | "memo";

export type Block = {
  id: string;
  kind: BlockKind;
  vcsState: "default" | "modified" | "added" | "removed";
  content: string;
};

export interface FileTab {
  id: string;
  fileName: string;
  path: string[];
  blocks: Block[];
}

interface EditorState {
  openFiles: FileTab[];
  activeTab: string | null;
  focusedBlockIndex: number | null;
  openFileById: (fileId: string) => Promise<void>;
  openFile: (file: FileTab) => void;
  closeFile: (fileId: string) => void;
  setActiveTab: (fileId: string) => void;
  addBlock: (fileId: string, kind: BlockKind, index?: number) => void;
  deleteBlock: (fileId: string, blockId: string) => void;
  reorderBlocks: (fileId: string, startIndex: number, endIndex: number) => void;
  updateBlockContent: (
    fileId: string,
    blockId: string,
    content: string
  ) => void;
  changeBlockKind: (fileId: string, blockId: string, kind: BlockKind) => void;
  setFocusedBlock: (index: number) => void;
  getActiveFile: () => FileTab | null;
}

function rustBlocksToBlocks(rustBlocks: RustBlock[]): Block[] {
  return rustBlocks.map((b) => ({
    id: b.id,
    kind: b.kind as BlockKind,
    vcsState: "default" as const,
    content: b.content,
  }));
}

function blocksToRustBlocks(blocks: Block[]): RustBlock[] {
  return blocks.map((b) => ({
    id: b.id,
    kind: b.kind,
    content: b.content,
  }));
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSave(projectPath: string, fileId: string, fileName: string, blocks: Block[]) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const doc: Document = {
      id: fileId,
      fileName,
      blocks: blocksToRustBlocks(blocks),
    };
    const result = await commands.saveDocument(projectPath, doc);
    if (result.status === "error") {
      console.error("Failed to save document:", result.error);
    }
  }, 1000);
}

function saveNow(projectPath: string, file: FileTab) {
  const doc: Document = {
    id: file.id,
    fileName: file.fileName,
    blocks: blocksToRustBlocks(file.blocks),
  };
  commands.saveDocument(projectPath, doc).then((result) => {
    if (result.status === "error") {
      console.error("Failed to save document:", result.error);
    }
  });
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  activeTab: null,
  focusedBlockIndex: null,

  openFileById: async (fileId: string) => {
    const { openFiles } = get();
    const isAlreadyOpen = openFiles.some((f) => f.id === fileId);

    if (isAlreadyOpen) {
      set({ activeTab: fileId });
      return;
    }

    const projectPath = useProjectStore.getState().projectPath;
    if (!projectPath) return;

    const result = await commands.loadDocument(projectPath, fileId);
    if (result.status === "ok") {
      const doc = result.data;
      const path = useProjectStore.getState().buildPath(fileId);
      const fileTab: FileTab = {
        id: doc.id,
        fileName: doc.fileName,
        path,
        blocks: rustBlocksToBlocks(doc.blocks),
      };

      set({
        openFiles: [...get().openFiles, fileTab],
        activeTab: fileId,
      });
    } else {
      console.error("Failed to load document:", result.error);
    }
  },

  openFile: (file) => {
    const { openFiles } = get();
    const isAlreadyOpen = openFiles.some((f) => f.id === file.id);

    if (isAlreadyOpen) {
      set({ activeTab: file.id });
    } else {
      set({
        openFiles: [...openFiles, file],
        activeTab: file.id,
      });
    }
  },

  closeFile: (fileId) => {
    const { openFiles, activeTab } = get();
    const fileIndex = openFiles.findIndex((f) => f.id === fileId);
    const newOpenFiles = openFiles.filter((f) => f.id !== fileId);

    let newActiveTab = activeTab;

    if (activeTab === fileId && newOpenFiles.length > 0) {
      const newActiveIndex = Math.min(fileIndex, newOpenFiles.length - 1);
      newActiveTab = newOpenFiles[newActiveIndex].id;
    } else if (newOpenFiles.length === 0) {
      newActiveTab = null;
    }

    set({
      openFiles: newOpenFiles,
      activeTab: newActiveTab,
    });
  },

  setActiveTab: (fileId) => {
    set({ activeTab: fileId });
  },

  addBlock: (fileId, kind, index) => {
    const { openFiles } = get();
    const projectPath = useProjectStore.getState().projectPath;

    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlock: Block = {
        id: crypto.randomUUID(),
        kind,
        vcsState: "added",
        content: "",
      };

      const newBlocks = [...file.blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }

      const updated = { ...file, blocks: newBlocks };
      if (projectPath) saveNow(projectPath, updated);
      return updated;
    });

    set({ openFiles: newOpenFiles });
  },

  deleteBlock: (fileId, blockId) => {
    const { openFiles } = get();
    const projectPath = useProjectStore.getState().projectPath;

    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlocks = file.blocks.filter((block) => block.id !== blockId);
      const updated = { ...file, blocks: newBlocks };
      if (projectPath) saveNow(projectPath, updated);
      return updated;
    });

    set({ openFiles: newOpenFiles });
  },

  reorderBlocks: (fileId, startIndex, endIndex) => {
    const { openFiles } = get();
    const projectPath = useProjectStore.getState().projectPath;

    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlocks = [...file.blocks];
      const [removed] = newBlocks.splice(startIndex, 1);
      newBlocks.splice(endIndex, 0, removed);

      const updated = { ...file, blocks: newBlocks };
      if (projectPath) saveNow(projectPath, updated);
      return updated;
    });

    set({ openFiles: newOpenFiles });
  },

  updateBlockContent: (fileId, blockId, content) => {
    const { openFiles } = get();
    const projectPath = useProjectStore.getState().projectPath;

    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlocks = file.blocks.map((block) => {
        if (block.id !== blockId) return block;
        const newVcsState: "added" | "modified" =
          block.vcsState === "added" ? "added" : "modified";
        return {
          ...block,
          content,
          vcsState: newVcsState,
        };
      });

      const updated = { ...file, blocks: newBlocks };
      if (projectPath) {
        debouncedSave(projectPath, updated.id, updated.fileName, updated.blocks);
      }
      return updated;
    });

    set({ openFiles: newOpenFiles });
  },

  changeBlockKind: (fileId, blockId, kind) => {
    const { openFiles } = get();
    const projectPath = useProjectStore.getState().projectPath;

    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlocks = file.blocks.map((block) => {
        if (block.id !== blockId) return block;
        const newVcsState: "added" | "modified" =
          block.vcsState === "added" ? "added" : "modified";
        return {
          ...block,
          kind,
          vcsState: newVcsState,
        };
      });

      const updated = { ...file, blocks: newBlocks };
      if (projectPath) saveNow(projectPath, updated);
      return updated;
    });

    set({ openFiles: newOpenFiles });
  },

  setFocusedBlock: (index) => {
    set({ focusedBlockIndex: index });
  },

  getActiveFile: () => {
    const { openFiles, activeTab } = get();
    return openFiles.find((f) => f.id === activeTab) ?? null;
  },
}));
