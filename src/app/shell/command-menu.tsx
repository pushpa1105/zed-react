import { Monitor, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useSession } from '@/core/auth/session';
import { translateLabel } from '@/core/feature/define-feature';
import { useTranslation } from '@/core/i18n/use-translation';
import { useNavigate } from '@/core/router/router';
import { useThemeStore } from '@/core/theme/store';
import { Kbd } from '@/shared/components/kbd';
import { Button } from '@/shared/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';

import { modules } from '../modules';
import { getCommands, getNavItems } from '../registry';

/**
 * ⌘K / Ctrl+K command palette. Pages come from every module's `nav`, actions
 * from every module's `commands`: new features show up here automatically.
 */
export function CommandMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user } = useSession();
  const setMode = useThemeStore((s) => s.setMode);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const run = (action: () => void) => {
    setOpen(false);
    action();
  };

  const pages = getNavItems(modules, user);
  const actions = getCommands(modules, user);
  const themeModes = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor },
  ] as const;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden w-56 justify-between text-muted-foreground sm:flex"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" /> {t('shell.commandMenu')}
        </span>
        <Kbd>Ctrl K</Kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        aria-label={t('shell.commandMenu')}
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title={t('shell.commandMenu')}>
        <Command>
          <CommandInput placeholder={t('shell.commandMenu')} />
          <CommandList>
            <CommandEmpty>{t('shell.commandEmpty')}</CommandEmpty>
            <CommandGroup heading={t('shell.commandPages')}>
              {pages.map((item) => (
                <CommandItem key={item.to} onSelect={() => run(() => void navigate(item.to))}>
                  <item.icon /> {translateLabel(item.label, t)}
                </CommandItem>
              ))}
            </CommandGroup>
            {actions.length > 0 && (
              <CommandGroup heading={t('shell.commandActions')}>
                {actions.map((command) => (
                  <CommandItem
                    key={command.id}
                    keywords={command.keywords}
                    onSelect={() => run(() => void navigate(command.to))}
                  >
                    <command.icon /> {translateLabel(command.label, t)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandGroup heading={t('shell.commandTheme')}>
              {themeModes.map(({ value, label, icon: Icon }) => (
                <CommandItem
                  key={value}
                  keywords={['theme', 'mode']}
                  onSelect={() => run(() => setMode(value))}
                >
                  <Icon /> {label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
