import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import { TextField } from '@/core/forms/text-field';
import { useTranslation } from '@/core/i18n/use-translation';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import {
  EMPTY_TASK,
  TASK_PRIORITIES,
  TASK_STATUSES,
  taskInputSchema,
  type TaskInput,
} from '../model/task';

type TaskFormProps = {
  id: string;
  defaultValues?: Partial<TaskInput>;
  onSubmit: (values: TaskInput) => void;
};

/**
 * Create/edit form. The submit button lives outside (in the dialog footer)
 * and is linked through the `form={id}` attribute.
 */
export function TaskForm({ id, defaultValues, onSubmit }: TaskFormProps) {
  const { t } = useTranslation('tasks');
  const form = useForm<TaskInput>({
    resolver: zodResolver(taskInputSchema),
    defaultValues: { ...EMPTY_TASK, ...defaultValues },
  });

  return (
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <TextField
          control={form.control}
          name="title"
          idPrefix={id}
          label={t('fields.title')}
          autoFocus
        />
        <TextField
          control={form.control}
          name="description"
          idPrefix={id}
          label={t('fields.description')}
          rows={4}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={`${id}-status`}>{t('fields.status')}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={`${id}-status`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {t(`status.${status}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="priority"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor={`${id}-priority`}>{t('fields.priority')}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={`${id}-priority`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_PRIORITIES.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {t(`priority.${priority}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
      </FieldGroup>
    </form>
  );
}
