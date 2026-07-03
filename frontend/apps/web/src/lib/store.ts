import { create } from "zustand";

type WorkspaceState = {
  selectedRepositoryId: string;
  selectedFilePath: string;
  terminalAllowed: boolean;
  setRepository: (repositoryId: string) => void;
  setFilePath: (path: string) => void;
  setTerminalAllowed: (allowed: boolean) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedRepositoryId: "repo-platform",
  selectedFilePath: "frontend/apps/web/src/app/page.tsx",
  terminalAllowed: false,
  setRepository: (repositoryId) => set({ selectedRepositoryId: repositoryId }),
  setFilePath: (selectedFilePath) => set({ selectedFilePath }),
  setTerminalAllowed: (terminalAllowed) => set({ terminalAllowed })
}));
