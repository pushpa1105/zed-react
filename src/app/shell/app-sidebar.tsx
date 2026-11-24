import { useSession } from '@/core/auth/session';
import { routes } from '@/core/config/routes';
import { translateLabel } from '@/core/feature/define-feature';
import { useTranslation } from '@/core/i18n/use-translation';
import { NavLink, useLocation } from '@/core/router/router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/shared/ui/sidebar';

import { modules } from '../modules';
import { getNavItems } from '../registry';

import { Logo } from './logo';
import { UserMenu } from './user-menu';

/** Navigation is generated from the feature manifests (filtered by role). */
export function AppSidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { data: user } = useSession();
  const items = getNavItems(modules, user);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo to={routes.app.href()} className="px-1 py-1.5" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const label = translateLabel(item.label, t);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.to)}
                      tooltip={label}
                    >
                      <NavLink to={item.to}>
                        <item.icon />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
