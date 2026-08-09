import { useCallback, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import {
  selectChildPanasById,
  selectRootPanas,
} from '@/features/pana/store/panaSelector';
import {
  addPana,
  deletePana,
  fetchRootPanas,
  togglePana,
} from '@/features/pana/store/panaSlice';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

const PanaItem = ({
  parentId,
  handleAddPage,
  handleDeletePana,
}: PanaItemProps) => {
  const { isMobile } = useSidebar();
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

  const handlePanaListFetch = useCallback(async () => {
    await dispatch(fetchRootPanas());
    if (id) dispatch(togglePana(id));
  }, [id, dispatch]);

  useEffect(() => {
    handlePanaListFetch();
  }, [handlePanaListFetch]);

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
