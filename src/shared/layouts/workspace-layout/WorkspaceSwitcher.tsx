import { ChevronsUpDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { updateActiveWorkspace } from '@/features/user';
import { useWorkspace, type WorkspaceType } from '@/features/workspaces';

import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shared/components/ui/sidebar';
import { withAsyncHandler } from '@/shared/utils';

import { cn, extractInitials } from '../../utils';

export const WorkspaceSwitcher = () => {
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspace();

  if (!activeWorkspace) {
    return null;
  }

  const goToCreateWorkspace = () => {
    navigate('/workspaces/create');
  };

  const switchWorkspace = async (w: WorkspaceType) => {
    await withAsyncHandler(() => updateActiveWorkspace(w._id), {
      onSuccess: () => setActiveWorkspace(w),
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar className="border bg-secondary rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {extractInitials(activeWorkspace?.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeWorkspace.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {workspaces.map((w) => (
              <DropdownMenuItem
                key={w.name}
                onClick={() =>
                  activeWorkspace._id !== w._id && switchWorkspace(w)
                }
                className={cn(
                  'gap-2 p-2',
                  activeWorkspace._id === w._id && 'bg-secondary'
                )}
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Avatar className="rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {extractInitials(w?.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {w.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={goToCreateWorkspace}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Add Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
