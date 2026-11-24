import type { PageModule } from '@/core/feature/define-feature';
import { useTranslation } from '@/core/i18n/use-translation';
import { Page } from '@/core/layout/page';
import { formatDate, getInitials } from '@/shared/lib/format';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

import { usersQuery, useUsers } from '../api/users';

export const loader: PageModule['loader'] =
  ({ queryClient }) =>
  async () => {
    await queryClient.prefetchQuery(usersQuery());
    return null;
  };

/** Admin-only page: the route and nav item are restricted in the manifest. */
export default function UsersPage() {
  const { t } = useTranslation('users');
  const users = useUsers();

  return (
    <Page title={t('page.title')} description={t('page.description')}>
      {users.isPending ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('table.name')}</TableHead>
                <TableHead>{t('table.role')}</TableHead>
                <TableHead className="hidden md:table-cell">{t('table.joined')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback>
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid">
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {t(`roles.${user.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDate(user.createdAt, 'MMM D, YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Page>
  );
}
