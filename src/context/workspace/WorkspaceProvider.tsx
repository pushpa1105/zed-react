import { WorkspaceContext } from "@/context/workspace/WorkspaceContext"
import { useAuth } from "@/hooks"
import { fetchMyWorkspacesWithPagination } from "@/services"
import type { WorkspaceType } from "@/types"
import { withAsyncHandler } from "@/utils/withAsyncHandler"
import { useCallback, useEffect, useState } from "react"

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth()
    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType | null>(null)
    const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([])

    const fetchMyWorkspaces = useCallback(async () => {
        await withAsyncHandler(
            () => fetchMyWorkspacesWithPagination(),
            {
                onSuccess: (res) => {
                    const data = res?.data?.data?.data
                    setWorkspaces(res?.data?.data?.data)

                    const ws = data.find((w: WorkspaceType) => w?._id == currentUser?.activeWorkspace) || data?.[0]

                    setActiveWorkspace(ws)
                }
            }
        )
    }, [currentUser?._id!])

    useEffect(() => {
        if (currentUser) fetchMyWorkspaces()
    }, [currentUser, fetchMyWorkspaces])

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
    )

}