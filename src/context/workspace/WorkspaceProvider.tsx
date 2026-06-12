import { WorkspaceContext } from "@/context/workspace/WorkspaceContext"
import { useAuth } from "@/hooks"
import { createPana, deletePana, fetchActiveWorkspacePanasWithPagination, fetchMyWorkspacesWithPagination } from "@/services"
import type { WorkspaceType } from "@/types"
import type { PanaType } from "@/types/pana.types"
import { withAsyncHandler } from "@/utils/withAsyncHandler"
import { useCallback, useEffect, useState } from "react"

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useAuth()
    const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType | null>(null)
    const [panas, setPanas] = useState<PanaType[] | []>([])
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

    const fetchPanas = async (addons?: any) => {
        await withAsyncHandler(
            () => fetchActiveWorkspacePanasWithPagination(addons),
            {
                onSuccess: (res) => {
                    const data = res?.data?.data?.data

                    const parentId = addons?.params?.parentId
                    if (!parentId) setPanas(prev => [...prev, ...data])
                    else {
                        const updateChildren = (panasList: PanaType[]): PanaType[] =>
                            panasList.map(pl =>
                                pl._id === parentId
                                    ? { ...pl, children: data, hasChildrenFetched: true }
                                    : { ...pl, children: updateChildren(pl?.children ?? []) }
                            )

                        setPanas(updateChildren(panas))
                    }
                }
            }
        )
    }

    const addPage = async (title?: string, parentId?: string) => {
        await withAsyncHandler(
            () => createPana(title, parentId),
            {
                onSuccess: (res) => {
                    const { _id, title, workspaceId, parentId } = res?.data?.data || {}

                    const newPana = { _id, title, workspaceId, parentId }

                    if (!_id) return

                    if (parentId) {
                        const updateChildren = (panasList: PanaType[]): PanaType[] =>
                            panasList.map(pl =>
                                pl._id === parentId
                                    ? { ...pl, children: [newPana, ...(pl?.children ?? [])], isOpen: true }
                                    : { ...pl, children: updateChildren(pl?.children ?? []) }
                            )
                        setPanas(updateChildren(panas))
                    } else setPanas(prev => [newPana, ...prev])
                }
            }
        )
    }

    const removePana = async (id: string) => {
        await withAsyncHandler(
            () => deletePana(id),
            {
                onSuccess: () => {
                    const filterChildren = (panasList: PanaType[]): PanaType[] =>
                        panasList
                            .filter(pl => pl?._id !== id)
                            .map(p => ({ ...p, children: filterChildren(p?.children ?? []) }))
                    setPanas(filterChildren(panas))
                }
            }
        )
    }

    const findPana = (panas: PanaType[], id: string): PanaType | undefined => {
        for (const p of panas) {
            if (p?._id == id) return p

            if ((p?.children ?? [])?.length > 0) {
                const found = findPana(p?.children ?? [], id)
                if (found) return found
            }
        };
    }

    const toggleNode = (panas: PanaType[], id: string) => {
        for (const p of panas) {
            if (p?._id == id) {
                p.isOpen = !p.isOpen
                return true
            }

            if ((p?.children ?? [])?.length > 0) {
                const found = toggleNode(p?.children ?? [], id)
                if (found) return true
            }
        };
    }

    const togglePana = (id: string) => {
        if (!findPana(panas, id)?.hasChildrenFetched) fetchPanas({ params: { parentId: id } })

        const newPanas = [...panas]
        toggleNode(newPanas, id)
        setPanas(newPanas);
    };


    useEffect(() => {
        if (currentUser) fetchMyWorkspaces()
    }, [currentUser, fetchMyWorkspaces])

    useEffect(() => {
        if (activeWorkspace) fetchPanas()
    }, [activeWorkspace])

    return (
        <WorkspaceContext.Provider
            value={{
                activeWorkspace,
                setActiveWorkspace,
                workspaces,
                panas,
                addPage,
                fetchPanas,
                togglePana,
                removePana
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    )

}