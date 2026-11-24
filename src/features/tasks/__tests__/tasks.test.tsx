import { renderApp, screen, waitFor, within } from '@/testing/test-utils';

describe('Tasks feature', () => {
  it('lists the first page of tasks', async () => {
    await renderApp('/app/tasks', { user: 'admin' });

    expect(await screen.findByText('Set up the project')).toBeInTheDocument();
    expect(screen.getByText(/page 1 of 2/i)).toBeInTheDocument();
  });

  it('filters by status through the URL', async () => {
    const { router } = await renderApp('/app/tasks?status=done', { user: 'admin' });

    expect(await screen.findByText('Add a new feature folder')).toBeInTheDocument();
    expect(screen.queryByText('Set up the project')).not.toBeInTheDocument();
    expect(router.state.location.search).toBe('?status=done');
  });

  it('ignores invalid URL filters instead of crashing', async () => {
    await renderApp('/app/tasks?page=banana&status=nope', { user: 'admin' });
    expect(await screen.findByText('Set up the project')).toBeInTheDocument();
  });

  it('creates a task', async () => {
    const { userEvent } = await renderApp('/app/tasks', { user: 'admin' });
    await screen.findByText('Set up the project');

    await userEvent.click(screen.getByRole('button', { name: /new task/i }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(within(dialog).getByLabelText(/title/i), 'Ship the starter');
    await userEvent.click(within(dialog).getByRole('button', { name: /create/i }));

    expect(await screen.findByText('Ship the starter')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('opens the create dialog from ?new=1 (used by the command menu)', async () => {
    await renderApp('/app/tasks?new=1', { user: 'admin' });
    expect(await screen.findByRole('dialog', { name: /new task/i })).toBeInTheDocument();
  });

  it('deletes a task after confirmation', async () => {
    const { userEvent } = await renderApp('/app/tasks', { user: 'admin' });
    const row = (await screen.findByText('Set up the project')).closest('tr')!;

    await userEvent.click(await within(row).findByRole('button', { name: /delete/i }));
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(within(dialog).getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(screen.queryByText('Set up the project')).not.toBeInTheDocument());
  });

  it("hides edit/delete on tasks the user doesn't own", async () => {
    await renderApp('/app/tasks', { user: 'member' });
    const row = (await screen.findByText('Set up the project')).closest('tr')!;

    expect(within(row).queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    expect(within(row).queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });
});
