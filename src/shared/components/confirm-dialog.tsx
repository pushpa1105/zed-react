import type { ReactNode } from 'react';

import { useDisclosure } from '@/shared/hooks/use-disclosure';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Spinner } from '@/shared/ui/spinner';

type ConfirmDialogProps = {
  /** The element that opens the dialog (rendered with `asChild`). */
  trigger: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  destructive?: boolean;
  pending?: boolean;
  /** Return a promise to keep the dialog open until it settles; it closes on success. */
  onConfirm: () => Promise<unknown> | void;
};

/** Generic "are you sure?" dialog. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive,
  pending,
  onConfirm,
}: ConfirmDialogProps) {
  const { isOpen, setIsOpen, close } = useDisclosure();

  const confirm = async () => {
    try {
      await onConfirm();
      close();
    } catch {
      /* keep the dialog open; the error is reported by the caller */
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{cancelLabel}</Button>
          </DialogClose>
          <Button
            variant={destructive ? 'destructive' : 'default'}
            disabled={pending}
            onClick={() => void confirm()}
          >
            {pending && <Spinner />} {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
