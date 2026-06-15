import type { WorkspaceType } from "@/types";
import { createContext } from "react";

export const WorkspaceContext = createContext({
    activeWorkspace: null as WorkspaceType | null,
    setActiveWorkspace: (_: WorkspaceType | null) => { },
    workspaces: [] as WorkspaceType[],
})