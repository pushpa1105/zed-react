# Tutorial: build a feature

We'll build a **Projects** feature: a list page backed by an API, then add create/delete, a
permission and a command. Allow about 20 minutes.

## Step 1: generate it

```bash
npm run generate
# ? feature
# ? Feature name: projects
npm run lint:fix && npm run format
```

The generator creates a complete, working module and wires it in:

```
src/features/projects/
├── index.ts                 manifest: route, nav item, translations
├── model/projects.ts        Zod schema → ProjectsItem type
├── api/projects.ts          query keys, request, query options, hook
├── pages/projects-page.tsx  page with a loader
├── i18n/en.json, es.json    "projects" namespace
└── __tests__/projects.test.tsx
src/mocks/handlers/projects.ts   fake GET /api/projects

+ routes.projects            in src/core/config/routes.ts
+ projects                   in src/app/modules.ts
+ projects namespace type    in src/app/i18n-resources.d.ts
+ projectsHandlers           in src/mocks/handlers/index.ts
```

Run `npm run dev`. "Projects" is already in the sidebar and in ⌘K. Run `npm test` and the new
test passes.

## Step 2: shape the model

Edit `model/projects.ts`. This schema is the single source of truth: it validates API responses
and produces the TypeScript type.

```ts
export const PROJECT_STATUSES = ['active', 'archived'] as const;

export const projectSchema = entitySchema.extend({
  name: z.string(),
  status: z.enum(PROJECT_STATUSES),
  ownerId: z.string(),
});
export type Project = z.infer<typeof projectSchema>;

/** Form + request body. Messages are i18n keys (see docs/forms.md). */
export const projectInputSchema = z.object({
  name: z.string().trim().min(1, 'validation.required').max(80, 'validation.tooLong'),
});
export type ProjectInput = z.infer<typeof projectInputSchema>;
```

Update the mock handler (`src/mocks/handlers/projects.ts`) to return matching data. Read
[Mock backend](mock-backend.md) to persist it in the fake database.

## Step 3: requests and hooks

Split plain requests from React hooks, as in `features/tasks/api/`:

```ts
// api/projects-api.ts
export const projectsApi = {
  list: (page: number) => api.get('/projects', paginated(projectSchema), { params: { page } }),
  create: (input: ProjectInput) => api.post('/projects', input, projectSchema),
  remove: (id: string) => api.delete(`/projects/${id}`),
};

// api/projects-queries.ts
export const projectsKeys = {
  all: ['projects'] as const,
  list: (page: number) => [...projectsKeys.all, 'list', page] as const,
};

export const projectsQuery = (page: number) =>
  queryOptions({ queryKey: projectsKeys.list(page), queryFn: () => projectsApi.list(page) });

export function useCreateProject(options?: MutationOptions<Project, ProjectInput>) {
  const { t } = useTranslation('projects');
  return useMutation({
    mutationFn: projectsApi.create,
    ...options,
    // Global handlers do the invalidation and the toast. No boilerplate here.
    meta: { invalidates: [projectsKeys.all], successMessage: t('toast.created'), ...options?.meta },
  });
}
```

## Step 4: a form in a dialog

```tsx
export function CreateProjectDialog() {
  const { t } = useTranslation(['projects', 'common']);
  const [open, setOpen] = useState(false);
  const create = useCreateProject({ onSuccess: () => setOpen(false) });
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectInputSchema),
    defaultValues: { name: '' },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('new')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('new')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((v) => create.mutate(v))} noValidate>
          <TextField control={form.control} name="name" label={t('fields.name')} autoFocus />
          <Button type="submit" disabled={create.isPending} className="mt-4">
            {t('common:actions.create')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

Add the new keys (`new`, `fields.name`, `toast.created`) to **both** `en.json` and `es.json`. The
translation test fails if one language is missing a key.

## Step 5: a permission

```ts
// model/project-policies.ts
export const projectPolicies = {
  delete: definePolicy<Pick<Project, 'ownerId'>>(
    (user, project) => rules.isAdmin(user) || project.ownerId === user.id,
  ),
};
```

```tsx
const canDelete = useCan(projectPolicies.delete, project);
// or
<Can policy={projectPolicies.delete} resource={project}>
  <DeleteButton />
</Can>;
```

Enforce the same rule on the server, too.

## Step 6: a ⌘K command

```ts
// index.ts
commands: [
  {
    id: 'projects.create',
    to: routes.projects.href({ new: 1 }),
    icon: Plus,
    label: (t) => t('projects:commands.create'),
    keywords: ['new', 'add'],
  },
],
```

In the page, open the dialog when `?new=1` is present (see `features/tasks/pages/tasks-page.tsx`).

## Step 7: a detail page

1. Add `project: defineRoute('/app/projects/:projectId')` to `core/config/routes.ts`.
2. Add `{ path: routes.project.path, access: 'protected', page: () => import('./pages/project-page') }`
   to the manifest.
3. Link to it with `routes.project.href({ projectId: p.id })`. Forgetting the param is a type
   error.

## Step 8: test it

```tsx
it('creates a project', async () => {
  const { userEvent } = await renderApp('/app/projects', { user: 'admin' });
  await userEvent.click(await screen.findByRole('button', { name: /new project/i }));
  await userEvent.type(screen.getByLabelText(/name/i), 'Apollo');
  await userEvent.click(screen.getByRole('button', { name: /create/i }));
  expect(await screen.findByText('Apollo')).toBeInTheDocument();
});
```

`renderApp` mounts the **real** app (registry, guards, shell) at a URL, so this also proves the
manifest is wired correctly.

## Checklist

- [ ] `npm run check` passes (types, lint, format, tests)
- [ ] Both `en.json` and `es.json` have every key
- [ ] Every link uses `routes.*.href()`
- [ ] Responses are parsed with a schema
- [ ] Permissions are checked with a policy, and enforced on the server too
- [ ] No imports from other features (lint enforces this)
