import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface ZedModalInterdace {
    title: string;
    description?: string;
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    onSubmit?(): void;
    modal?: boolean;
    hideFooter?: boolean;
}

const ZedModal = ({
    title,
    description,
    children,
    open,
    onOpenChange,
    onSubmit,
    hideFooter
}: ZedModalInterdace) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    {children}
                </div>
                {
                    !hideFooter &&
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                        <Button type="submit" onClick={onSubmit}>Save changes</Button>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}

export default ZedModal;
