import { useCallback, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import {
  addPana,
  deletePana,
  fetchRootPanas,
  type PanaType,
  renamePana,
  selectChildPanasById,
  selectRootPanas,
  togglePana,
} from '@/features/pana';
import { useWorkspace } from '@/features/workspaces';

import { RenamePanaMenu } from '@/shared/layouts/workspace-layout/RenamePanaMenu';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../../components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';

interface PanaItemProps {
  parentId?: string;
  handleAddPage: (id?: string) => void;
  handleDeletePana: (id: string) => void;
}

const PanaItemMenu = ({
  pana,
  handleAddPage,
  handleDeletePana,
}: {
  pana: PanaType;
  handleAddPage: (id?: string) => void;
  handleDeletePana: (id: string) => void;
}) => {
  const { isMobile } = useSidebar();
  const dispatch = useAppDispatch();

  const handleRename = (updatedTitle: string) =>
    dispatch(renamePana({ panaId: pana._id, updatedTitle }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction showOnHover>
          <MoreHorizontal />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align={isMobile ? 'end' : 'start'}
      >
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Pencil className="text-muted-foreground mr-2 h-4 w-4" />
            <span>Rename</span>
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="p-2">
            <RenamePanaMenu panaTitle={pana.title} handleSave={handleRename} />
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => handleAddPage(pana._id)}>
          <Plus className="text-muted-foreground" />
          <span>Add a new page</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDeletePana(pana._id)}>
          <Trash2 className="text-muted-foreground" />
          <span>Move to Trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const PanaItem = ({
  parentId,
  handleAddPage,
  handleDeletePana,
}: PanaItemProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const panas = useAppSelector(
    parentId ? selectChildPanasById(parentId) : selectRootPanas
  );

  if (panas?.length === 0)
    return (
      <SidebarMenuItem className="text-xs text-muted-foreground">
        No pages inside
      </SidebarMenuItem>
    );

  const toggleOpen = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(togglePana(id));
  };

  return panas.map((item) => (
    <div key={item._id}>
      <SidebarMenuItem className="group/item active">
        <SidebarMenuButton asChild isActive={id === item._id}>
          <Link to={`/${item._id}`}>
            <div>
              <div className="group-hover/item:hidden border rounded border-transparent">
                <FileText className="group-hover/item:hidden" size={15} />
              </div>
              <div className="hidden group-hover/item:flex border rounded border-transparent hover:border-gray-300 hover:bg-gray-200">
                {item?.isOpen ? (
                  <ChevronUp
                    className="hover:border hover:rounded-md"
                    onClick={(e) => toggleOpen(e, item?._id)}
                    size={15}
                  />
                ) : (
                  <ChevronDown
                    size={15}
                    onClick={(e) => toggleOpen(e, item?._id)}
                    className="hover:border hover:rounded-md"
                  />
                )}
              </div>
            </div>
            <span>{item?.title ?? 'New Page'}</span>
          </Link>
        </SidebarMenuButton>

        <PanaItemMenu
          pana={item}
          handleAddPage={handleAddPage}
          handleDeletePana={handleDeletePana}
        />
      </SidebarMenuItem>
      {item?.isOpen && (
        <div className="pl-4">
          <PanaItem
            parentId={item._id}
            key={item._id}
            handleAddPage={handleAddPage}
            handleDeletePana={handleDeletePana}
          />
        </div>
      )}
    </div>
  ));
};

export function NavPanas() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { activeWorkspace } = useWorkspace();

  const handlePanaListFetch = useCallback(
    async (workspaceId: string) => {
      await dispatch(fetchRootPanas(workspaceId));
      if (id) dispatch(togglePana(id));
    },
    [id, dispatch]
  );

  useEffect(() => {
    if (!activeWorkspace?._id) return;

    handlePanaListFetch(activeWorkspace?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspace]);

  const handleAddPana = (parentId?: string) => dispatch(addPana(parentId));
  const removePana = (panaId: string) => dispatch(deletePana(panaId));

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenuItem className="flex w-full">
        Private
        <SidebarMenuAction showOnHover>
          <Tooltip>
            <TooltipTrigger asChild>
              <Plus onClick={() => handleAddPana()} />
            </TooltipTrigger>
            <TooltipContent>Add a page</TooltipContent>
          </Tooltip>
        </SidebarMenuAction>
      </SidebarMenuItem>
      <SidebarMenu>
        <PanaItem handleAddPage={handleAddPana} handleDeletePana={removePana} />
      </SidebarMenu>
    </SidebarGroup>
  );
}
