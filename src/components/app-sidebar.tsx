import * as React from "react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavPanas } from "@/components/nav-panas"
import { useAuth } from "@/hooks"
import { WorkspaceSwitcher } from "@/components/features/workspaces/workspace-switcher"

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { currentUser } = useAuth()

  const user = {
    name: currentUser?.name || 'N/A',
    email: currentUser?.email || 'N/A',
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
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
  )
}
