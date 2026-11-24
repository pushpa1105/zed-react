import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';

type PagerProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  labels?: { previous: string; next: string; status: string };
};

/** Minimal previous/next pagination. Renders nothing for a single page. */
export function Pager({
  page,
  totalPages,
  onPageChange,
  labels = {
    previous: 'Previous page',
    next: 'Next page',
    status: `Page ${page} of ${totalPages}`,
  },
}: PagerProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-end gap-2 text-sm">
      <span className="text-muted-foreground">{labels.status}</span>
      <Button
        variant="outline"
        size="icon"
        aria-label={labels.previous}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label={labels.next}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
