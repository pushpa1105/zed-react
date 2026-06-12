import { useContext } from "react";
import { WorkspaceContext } from "@/context/workspace/WorkspaceContext";

export const useWorkspace = () => useContext(WorkspaceContext)
