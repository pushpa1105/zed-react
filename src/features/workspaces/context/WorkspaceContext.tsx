import { createContext } from 'react';

import type { WorkspaceType } from '../types';

export const WorkspaceContext = createContext({
  activeWorkspace: null as WorkspaceType | null,
  setActiveWorkspace: (_: WorkspaceType | null) => {},
  workspaces: [] as WorkspaceType[],
});
