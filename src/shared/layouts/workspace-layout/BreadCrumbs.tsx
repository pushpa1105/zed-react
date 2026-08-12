import { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'; // swap for next/navigation if Next.js

import { renamePana, selectPanaBreadCrumbs } from '@/features/pana';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { useIsMobile } from '@/shared/hooks';
import { RenamePanaMenu } from '@/shared/layouts/workspace-layout/RenamePanaMenu';

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';

interface BreadcrumbsProps {
  maxVisible?: number; // how many crumbs to show before collapsing, default 3
}

export function Breadcrumbs({ maxVisible = 3 }: BreadcrumbsProps) {
  const { id: panaId } = useParams();
  const dispatch = useAppDispatch();
  const selector = useMemo(() => selectPanaBreadCrumbs(panaId), [panaId]);
  const crumbs = useAppSelector(selector);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleRename = (updatedTitle: string) =>
    panaId && dispatch(renamePana({ panaId, updatedTitle }));

  if (crumbs.length === 0) return null;

  const goTo = (id: string) => navigate(`/${id}`);

  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null;
  const current = crumbs[crumbs.length - 1];

  // MOBILE
  if (isMobile) {
    return (
      <div className="flex items-center gap-1 w-full min-w-0">
        {parent && (
          <button
            onClick={() => goTo(parent._id)}
            className="flex items-center gap-0.5 text-muted-foreground shrink-0 -ml-1 px-1 py-1 active:opacity-60"
            aria-label={`Back to ${parent.title || 'Untitled'}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {crumbs.length > 2 && (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button className="text-muted-foreground shrink-0 px-1 py-1 active:opacity-60">
                <BreadcrumbEllipsis className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[60vh]">
              <div className="flex flex-col mt-2">
                {crumbs.slice(0, -1).map((crumb, i: number) => (
                  <button
                    key={crumb._id}
                    onClick={() => {
                      setSheetOpen(false);
                      goTo(crumb._id);
                    }}
                    className="flex items-center gap-2 py-2.5 text-left text-sm active:bg-muted rounded-md px-2"
                    style={{ paddingLeft: `${8 + i * 12}px` }}
                  >
                    {crumb.title || 'Untitled'}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}

        <span className="text-sm font-medium truncate min-w-0">
          {current.title || 'Untitled'}
        </span>
      </div>
    );
  }

  //DESKTOP
  const shouldCollapse = crumbs.length > maxVisible;
  const first = crumbs[0];
  const last = current;
  const visibleTail = shouldCollapse
    ? crumbs.slice(-(maxVisible - 1), -1)
    : crumbs.slice(1, -1);
  const hidden = shouldCollapse
    ? crumbs.slice(1, crumbs.length - maxVisible + 1)
    : [];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <button
              onClick={() => goTo(first._id)}
              className="hover:text-foreground"
            >
              {first.title || 'A New Page'}
            </button>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {shouldCollapse && hidden.length > 0 && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center hover:text-foreground">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Show hidden pages</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hidden.map((crumb) => (
                    <DropdownMenuItem
                      key={crumb._id}
                      onClick={() => goTo(crumb._id)}
                    >
                      {crumb.title || 'Untitled'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        )}

        {visibleTail.map((crumb) => (
          <span key={crumb._id} className="flex items-center gap-1.5">
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <button
                  onClick={() => goTo(crumb._id)}
                  className="hover:text-foreground"
                >
                  {crumb.title || 'Untitled'}
                </button>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </span>
        ))}

        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[220px] truncate">
                {last.title || 'Untitled'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <RenamePanaMenu panaTitle={last.title} handleSave={handleRename} />
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
