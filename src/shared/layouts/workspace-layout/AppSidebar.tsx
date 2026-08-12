import * as React from 'react';

import { useAuth } from '@/features/auth';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/shared/components/ui/sidebar';

import { NavPanas } from './NavPanas';
import { NavUser } from './NavUser';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { currentUser } = useAuth();

  const user = {
    name: currentUser?.name || 'N/A',
    email: currentUser?.email || 'N/A',
    avatar: '/avatars/shadcn.jpg',
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavPanas />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
