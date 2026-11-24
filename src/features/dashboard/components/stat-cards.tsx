import { CheckCircle2, Circle, ListTodo, Timer, type LucideIcon } from 'lucide-react';

import { useTranslation } from '@/core/i18n/use-translation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

import { useStats, type Stats } from '../api/stats';

const CARDS: Array<{ key: keyof Stats; icon: LucideIcon }> = [
  { key: 'total', icon: ListTodo },
  { key: 'todo', icon: Circle },
  { key: 'inProgress', icon: Timer },
  { key: 'done', icon: CheckCircle2 },
];

export function StatCards() {
  const { t } = useTranslation('dashboard');
  const stats = useStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map(({ key, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t(`stats.${key}`)}
            </CardTitle>
            <Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {stats.isPending ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-semibold tabular-nums">{stats.data?.[key] ?? 0}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
