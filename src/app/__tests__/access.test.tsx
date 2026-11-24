import { renderApp, screen } from '@/testing/test-utils';

describe('access control', () => {
  it('redirects signed-out users to sign in', async () => {
    const { router } = await renderApp('/app/dashboard');
    expect(await screen.findByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(router.state.location.search).toBe('?redirectTo=%2Fapp%2Fdashboard');
  });

  it('redirects signed-in users away from guest pages', async () => {
    const { router } = await renderApp('/login', { user: 'admin' });
    expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/app/dashboard');
  });

  it('shows admin-only navigation and pages to admins', async () => {
    await renderApp('/app/users', { user: 'admin' });
    expect(await screen.findByRole('heading', { name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Users' })).toBeInTheDocument();
  });

  it('hides admin-only navigation and blocks the page for members', async () => {
    await renderApp('/app/users', { user: 'member' });
    expect(await screen.findByText(/you don't have access/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Users' })).not.toBeInTheDocument();
  });
});
