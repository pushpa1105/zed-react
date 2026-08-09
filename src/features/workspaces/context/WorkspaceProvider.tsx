import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/features/auth';

import { withAsyncHandler } from '@/shared/utils';

import { fetchMyWorkspacesWithPagination } from '../api';
import type { WorkspaceType } from '../types';

import { WorkspaceContext } from './WorkspaceContext';

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentUser } = useAuth();
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType | null>(
    null
  );
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);

  const fetchMyWorkspaces = useCallback(async () => {
    await withAsyncHandler(() => fetchMyWorkspacesWithPagination(), {
      onSuccess: (res) => {
        const data = res?.data?.data?.data;
        setWorkspaces(res?.data?.data?.data);

        const ws =
          data.find(
            (w: WorkspaceType) => w?._id == currentUser?.activeWorkspace
          ) || data?.[0];

        setActiveWorkspace(ws);
      },
    });
  }, [currentUser?.activeWorkspace]);

  useEffect(() => {
    if (currentUser) fetchMyWorkspaces();
  }, [currentUser, fetchMyWorkspaces]);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        setActiveWorkspace,
        workspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
