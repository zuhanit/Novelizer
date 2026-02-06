import { create } from "zustand";

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
  blocks: Block[];
}

interface EditorState {
  openFiles: FileTab[];
  activeTab: string | null;
  focusedBlockIndex: number | null;
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
  changeBlockKind: (
    fileId: string,
    blockId: string,
    kind: BlockKind
  ) => void;
  setFocusedBlock: (index: number) => void;
  getActiveFile: () => FileTab | null;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  activeTab: null,
  focusedBlockIndex: null,

  openFile: (file) => {
    const { openFiles } = get();
    const isAlreadyOpen = openFiles.some((f) => f.id === file.id);

    if (isAlreadyOpen) {
      // Just activate the tab if already open
      set({ activeTab: file.id });
    } else {
      // Add to open files and activate
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

    // If closing the active tab, switch to adjacent tab
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
    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlock = {
        id: crypto.randomUUID(),
        kind,
        vcsState: "added" as const,
        content: "",
      };

      const newBlocks = [...file.blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }

      return { ...file, blocks: newBlocks };
    });

    set({ openFiles: newOpenFiles });
  },

  deleteBlock: (fileId, blockId) => {
    const { openFiles } = get();
    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlocks = file.blocks.filter((block) => block.id !== blockId);
      return { ...file, blocks: newBlocks };
    });

    set({ openFiles: newOpenFiles });
  },

  reorderBlocks: (fileId, startIndex, endIndex) => {
    const { openFiles } = get();
    const newOpenFiles = openFiles.map((file) => {
      if (file.id !== fileId) return file;

      const newBlocks = [...file.blocks];
      const [removed] = newBlocks.splice(startIndex, 1);
      newBlocks.splice(endIndex, 0, removed);

      return { ...file, blocks: newBlocks };
    });

    set({ openFiles: newOpenFiles });
  },

  updateBlockContent: (fileId, blockId, content) => {
    const { openFiles } = get();
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

      return { ...file, blocks: newBlocks };
    });

    set({ openFiles: newOpenFiles });
  },

  changeBlockKind: (fileId, blockId, kind) => {
    const { openFiles } = get();
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

      return { ...file, blocks: newBlocks };
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
