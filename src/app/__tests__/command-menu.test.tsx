import { renderApp, screen, waitFor } from '@/testing/test-utils';

describe('command menu', () => {
  it('opens with Ctrl+K and runs a command contributed by a feature', async () => {
    const { userEvent, router } = await renderApp('/app/dashboard', { user: 'admin' });
    await screen.findByRole('heading', { name: /welcome back/i });

    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.type(await screen.findByPlaceholderText(/search or jump/i), 'create a task');
    await userEvent.keyboard('{Enter}');

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/tasks'));
    expect(router.state.location.search).toBe('?new=1');
  });
});
