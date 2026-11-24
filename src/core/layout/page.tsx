import type { ReactNode } from 'react';

import { PageHeader } from '@/shared/components/page-header';
import { cn } from '@/shared/lib/cn';

import { Head } from './head';

type PageProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** `narrow` for detail/form pages, `wide` (default) for lists and dashboards. */
  width?: 'narrow' | 'wide';
  children: ReactNode;
};

/** Standard page inside the app shell: document title + header + content. */
export function Page({ title, description, actions, width = 'wide', children }: PageProps) {
  return (
    <>
      <Head title={title} description={description} />
      <div
        className={cn(
          'mx-auto w-full space-y-6 p-4 md:p-8',
          width === 'wide' ? 'max-w-6xl' : 'max-w-3xl',
        )}
      >
        <PageHeader title={title} description={description} actions={actions} />
        {children}
      </div>
    </>
  );
}
