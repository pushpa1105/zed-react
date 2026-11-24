import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';

import { useCurrentUser, useSignOut } from '@/core/auth/session';
import { routes } from '@/core/config/routes';
import { useTranslation } from '@/core/i18n/use-translation';
import { Link, useNavigate } from '@/core/router/router';
import { getInitials } from '@/shared/lib/format';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/shared/ui/sidebar';

export function UserMenu() {
  const { t } = useTranslation(['common', 'settings']);
  const navigate = useNavigate();
  const user = useCurrentUser();
  const signOut = useSignOut();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56">
            <DropdownMenuLabel>{t('shell.account')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={routes.settings.href({ tab: 'profile' })}>
                <Settings /> {t('settings:nav')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                signOut.mutate(undefined, { onSettled: () => void navigate(routes.login.href()) })
              }
            >
              <LogOut /> {t('shell.signOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
