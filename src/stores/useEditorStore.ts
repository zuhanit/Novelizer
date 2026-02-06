import { create } from "zustand";

export type BlockKind = "content" | "memo";

export interface FileTab {
  id: string;
  fileName: string;
  path: string[];
  blocks: {
    kind: BlockKind;
    vcsState: "default" | "modified" | "added" | "removed";
    content: string;
  }[];
}

interface EditorState {
  openFiles: FileTab[];
  activeTab: string | null;
  openFile: (file: FileTab) => void;
  closeFile: (fileId: string) => void;
  setActiveTab: (fileId: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  activeTab: null,

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
}));
