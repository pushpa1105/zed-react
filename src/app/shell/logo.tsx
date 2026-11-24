import { Layers } from 'lucide-react';

import { routes } from '@/core/config/routes';
import { siteConfig } from '@/core/config/site';
import { Link } from '@/core/router/router';
import { cn } from '@/shared/lib/cn';

export function Logo({ className, to = routes.home.href() }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2 font-semibold', className)}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Layers className="size-4" />
      </span>
      <span className="truncate">{siteConfig.name}</span>
    </Link>
  );
}
