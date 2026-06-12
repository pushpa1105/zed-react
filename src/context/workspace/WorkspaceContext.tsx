import type { PanaType, WorkspaceType } from "@/types";
import { createContext } from "react";

export const WorkspaceContext = createContext({
    activeWorkspace: null as WorkspaceType | null,
    setActiveWorkspace: (_: WorkspaceType | null) => { },
    workspaces: [] as WorkspaceType[],
    panas: [] as PanaType[],
    addPage: (title?: string, parentId?: string) => { },
    fetchPanas: (addons?: any) => { },
    togglePana: (id: string) => { },
    removePana: (id: string) => { }
})