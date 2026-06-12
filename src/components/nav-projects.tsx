import {
    ChevronDown,
    ChevronUp,
    FileText,
    MoreHorizontal,
    Plus,
    Trash2,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useWorkspace } from "@/hooks"
import type { PanaType } from "@/types"

interface PanaItemProps {
    panas: (PanaType & { isOpen?: boolean })[],
    handleToggle: (id: string) => void,
    handleAddPage: (id?: string) => void
    handleDeletePana: (id: string) => void
}

const PanaItem = ({ panas, handleToggle, handleAddPage, handleDeletePana }: PanaItemProps) => {
    const { isMobile } = useSidebar()

    if (panas?.length === 0) return <SidebarMenuItem className="text-xs text-muted-foreground">No pages inside</SidebarMenuItem>

    const toggleOpen = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, id: string) => {
        e.preventDefault()
        e.stopPropagation()

        handleToggle(id)
    };

    return (
        panas.map((item) => (
            <div key={item._id} >
                <SidebarMenuItem className="group/item">
                    <SidebarMenuButton asChild>
                        <a href={item._id}>
                            <div>
                                <div className="group-hover/item:hidden border rounded border-transparent">
                                    <FileText className="group-hover/item:hidden" size={15} />
                                </div>
                                <div className="hidden group-hover/item:flex border rounded border-transparent hover:border-gray-300 hover:bg-gray-200">
                                    {
                                        item?.isOpen
                                            ?
                                            <ChevronUp className="hover:border hover:rounded-md"
                                                onClick={(e) => toggleOpen(e, item?._id)}
                                                size={15}
                                            />
                                            :
                                            <ChevronDown size={15}
                                                onClick={(e) => toggleOpen(e, item?._id)}
                                                className="hover:border hover:rounded-md"
                                            />
                                    }
                                </div>
                            </div>
                            <span>{item?.title ?? 'New Page'}</span>
                        </a>
                    </SidebarMenuButton>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuAction showOnHover>
                                <MoreHorizontal />
                                <span className="sr-only">More</span>
                            </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-48 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                        >
                            <DropdownMenuItem onClick={() => handleAddPage(item._id)}>
                                <Plus className="text-muted-foreground" />
                                <span>Add a new page</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeletePana(item._id)}>
                                <Trash2 className="text-muted-foreground" />
                                <span>Move to Trash</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
                {
                    item?.isOpen && (
                        <div className="pl-4">
                            <PanaItem
                                panas={item?.children || []} key={item._id}
                                handleAddPage={handleAddPage}
                                handleToggle={handleToggle}
                                handleDeletePana={handleDeletePana}
                            />
                        </div>
                    )
                }
            </div>
        )
        )
    )
}

export function NavProjects() {
    const { panas, addPage, togglePana, removePana } = useWorkspace()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuItem className="flex w-full">
                Private
                <SidebarMenuAction showOnHover>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Plus onClick={() => addPage()} />
                        </TooltipTrigger>
                        <TooltipContent>
                            Add a page
                        </TooltipContent>
                    </Tooltip>
                </SidebarMenuAction>
            </SidebarMenuItem>
            <SidebarMenu>
                <PanaItem
                    panas={panas}
                    handleToggle={togglePana}
                    handleAddPage={(id) => addPage(undefined, id)}
                    handleDeletePana={removePana}
                />
            </SidebarMenu>
        </SidebarGroup>
    )
}
