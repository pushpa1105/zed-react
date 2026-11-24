import type { HTMLInputTypeAttribute } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { Field, FieldDescription, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

import { FormFieldError } from './form-field-error';

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  /** Prefix for the input id, to keep ids unique when a form renders twice. */
  idPrefix?: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  autoFocus?: boolean;
  placeholder?: string;
  /** Render a <textarea> with this many rows. */
  rows?: number;
};

/**
 * Label + input + translated error for a React Hook Form field, wired for
 * accessibility (`htmlFor`, `aria-invalid`). Use `Controller` directly for
 * anything more custom (selects, switches…).
 */
export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  idPrefix,
  rows,
  ...inputProps
}: TextFieldProps<T>) {
  const id = idPrefix ? `${idPrefix}-${name}` : name;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {rows ? (
            <Textarea {...field} id={id} rows={rows} aria-invalid={fieldState.invalid} />
          ) : (
            <Input {...field} {...inputProps} id={id} aria-invalid={fieldState.invalid} />
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
          <FormFieldError error={fieldState.error} />
        </Field>
      )}
    />
  );
}
