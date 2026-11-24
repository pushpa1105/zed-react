import type { FieldError as RhfFieldError } from 'react-hook-form';

import { useTranslation } from '@/core/i18n/use-translation';
import { FieldError } from '@/shared/ui/field';

/**
 * Renders a field's validation error. Zod messages are i18n keys from the
 * `common:validation.*` group (e.g. `z.string().min(1, 'validation.required')`),
 * so they are translated here. Plain-text messages are shown as-is.
 */
export function FormFieldError({ error }: { error?: RhfFieldError }) {
  const { t } = useTranslation();
  if (!error?.message) return null;
  const message = t(error.message as 'validation.required', { defaultValue: error.message });
  return <FieldError>{message}</FieldError>;
}
