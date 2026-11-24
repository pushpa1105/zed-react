# Forms

Forms use **React Hook Form** for state, **Zod** for validation (the same schemas as the API
layer) and shadcn's **Field** components for accessible markup.

## The quick way: `TextField`

[`core/forms/text-field.tsx`](../src/core/forms/text-field.tsx) renders label + input (or
textarea) + translated error, wired with `htmlFor` and `aria-invalid`:

```tsx
const form = useForm<Credentials>({
  resolver: zodResolver(credentialsSchema),
  defaultValues: { email: '', password: '' },
});

<form onSubmit={form.handleSubmit((values) => signIn.mutate(values))} noValidate>
  <FieldGroup>
    <TextField control={form.control} name="email" label={t('fields.email')} type="email" autoComplete="email" />
    <TextField control={form.control} name="password" label={t('fields.password')} type="password" />
    <TextField control={form.control} name="bio" label="Bio" rows={3} description="Up to 280 characters." />
  </FieldGroup>
</form>;
```

`name` is type-checked against the form values. Use `idPrefix` when the same form can render
twice on a page.

## Custom controls

For selects, switches, date pickers and the like, use `Controller` with the Field parts:

```tsx
<Controller
  name="status"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="status">{t('fields.status')}</FieldLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger id="status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>…</SelectContent>
      </Select>
      <FormFieldError error={fieldState.error} />
    </Field>
  )}
/>
```

## Translated validation messages

Zod messages are **i18n keys** from `common:validation.*`. `FormFieldError` translates them.
Plain text still works (it is shown as-is).

```ts
z.string().trim().min(1, 'validation.required').max(120, 'validation.tooLong');
z.email('validation.email');
```

Add new messages to `core/i18n/locales/{en,es}.json` under `validation`.

## Server errors

Auth forms set `meta: { errorMessage: false }` on their mutation (no toast) and render the
error inline:

```tsx
{signIn.isError && (
  <Alert variant="destructive">
    <AlertDescription>{getErrorMessage(signIn.error)}</AlertDescription>
  </Alert>
)}
```

For field-level server errors, call `form.setError('email', { message: '…' })` in `onError`.

## Submit outside the form

Dialogs keep buttons in the footer. Link them with `form={id}`:

```tsx
<TaskForm id={formId} onSubmit={submit} />
<Button type="submit" form={formId}>Save</Button>
```

## Tips

- `defaultValues` for create forms, `values` for edit forms fed by a query (it resets when the
  data changes, as in `ProfileSection`).
- Disable submit while pending, and for edits also until `formState.isDirty`.
- Always pass `noValidate` so the browser doesn't show its own bubbles over yours.
