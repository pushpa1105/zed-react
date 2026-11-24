import { cn } from '@/shared/lib/cn';
import { Spinner } from '@/shared/ui/spinner';

/** Centered spinner used as a Suspense / route fallback. */
export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-[50svh] w-full items-center justify-center', className)}>
      <Spinner className="size-6 text-muted-foreground" />
    </div>
  );
}
