import { Check, ClipboardCopy, Monitor, Moon, RotateCcw, Sun } from 'lucide-react';

import { useTranslation } from '@/core/i18n/use-translation';
import { notify } from '@/core/notify/notify';
import { cn } from '@/shared/lib/cn';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';

import { THEME_FONTS, THEME_PRESETS, THEME_RADII, THEME_SCALES } from '../config';
import { buildThemeCss } from '../engine';
import { useThemeStore } from '../store';

function OptionButton({
  active,
  className,
  ...props
}: React.ComponentProps<typeof Button> & { active: boolean }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-pressed={active}
      className={cn('justify-start', active && 'border-primary ring-2 ring-primary/30', className)}
      {...props}
    />
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </Label>
      {children}
    </div>
  );
}

/**
 * Full theme editor: mode, color preset, custom brand color, radius, font and
 * scale. Every option is generated from `core/theme/config.ts`.
 */
export function ThemeCustomizer({ className }: { className?: string }) {
  const { t } = useTranslation();
  const theme = useThemeStore();

  const modes = [
    { value: 'light', label: t('theme.light'), icon: Sun },
    { value: 'dark', label: t('theme.dark'), icon: Moon },
    { value: 'system', label: t('theme.system'), icon: Monitor },
  ] as const;

  const copyCss = async () => {
    try {
      await navigator.clipboard.writeText(buildThemeCss());
      notify.success(t('theme.copied'));
    } catch {
      notify.error(t('theme.copyFailed'));
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Section label={t('theme.mode')}>
        <div className="grid grid-cols-3 gap-2">
          {modes.map(({ value, label, icon: Icon }) => (
            <OptionButton
              key={value}
              active={theme.mode === value}
              onClick={() => theme.setMode(value)}
            >
              <Icon /> {label}
            </OptionButton>
          ))}
        </div>
      </Section>

      <Section label={t('theme.color')}>
        <div className="grid grid-cols-3 gap-2">
          {THEME_PRESETS.map((preset) => {
            const active = !theme.customPrimary && theme.preset === preset.value;
            return (
              <OptionButton
                key={preset.value}
                active={active}
                onClick={() => theme.setPreset(preset.value)}
              >
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: preset.swatch }}
                >
                  {active && <Check className="size-3 text-white" />}
                </span>
                {preset.label}
              </OptionButton>
            );
          })}
        </div>
        <label className="flex items-center justify-between gap-3 rounded-md border p-2 text-sm">
          <span>{t('theme.customColor')}</span>
          <span className="flex items-center gap-2">
            {theme.customPrimary && (
              <span className="font-mono text-xs text-muted-foreground">{theme.customPrimary}</span>
            )}
            <input
              type="color"
              aria-label={t('theme.customColor')}
              value={theme.customPrimary ?? '#3b82f6'}
              onChange={(e) => theme.setCustomPrimary(e.target.value)}
              className="size-8 cursor-pointer rounded border-0 bg-transparent p-0"
            />
          </span>
        </label>
      </Section>

      <Section label={t('theme.radius')}>
        <div className="grid grid-cols-6 gap-2">
          {THEME_RADII.map((radius) => (
            <OptionButton
              key={radius}
              active={theme.radius === radius}
              onClick={() => theme.setRadius(radius)}
              className="justify-center px-0"
            >
              {radius}
            </OptionButton>
          ))}
        </div>
      </Section>

      <Section label={t('theme.font')}>
        <div className="grid grid-cols-4 gap-2">
          {THEME_FONTS.map((font) => (
            <OptionButton
              key={font.value}
              active={theme.font === font.value}
              onClick={() => theme.setFont(font.value)}
              className="justify-center"
            >
              {font.label}
            </OptionButton>
          ))}
        </div>
      </Section>

      <Section label={t('theme.scale')}>
        <div className="grid grid-cols-3 gap-2">
          {THEME_SCALES.map((scale) => (
            <OptionButton
              key={scale.value}
              active={theme.scale === scale.value}
              onClick={() => theme.setScale(scale.value)}
              className="justify-center"
            >
              {scale.label}
            </OptionButton>
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => void copyCss()}>
          <ClipboardCopy /> {t('theme.copyCss')}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={theme.reset}>
          <RotateCcw /> {t('theme.reset')}
        </Button>
      </div>
    </div>
  );
}
