import { DEMO_USER } from '@/mocks/db';
import { renderApp, renderWithProviders, screen, waitFor } from '@/testing/test-utils';

import { SignInForm } from '../components/sign-in-form';

describe('SignInForm', () => {
  it('validates the fields', async () => {
    const onSuccess = vi.fn();
    const { userEvent } = await renderWithProviders(<SignInForm onSuccess={onSuccess} />);

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('shows the server error for wrong credentials', async () => {
    const { userEvent } = await renderWithProviders(<SignInForm />);

    await userEvent.type(screen.getByLabelText(/email/i), DEMO_USER.email);
    await userEvent.type(screen.getByLabelText(/password/i), 'wrong-password');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it('signs in and returns the user to the page they asked for', async () => {
    const { userEvent, router } = await renderApp('/app/tasks');

    // The auth guard bounced us to /login?redirectTo=/app/tasks
    await userEvent.type(await screen.findByLabelText(/email/i), DEMO_USER.email);
    await userEvent.type(screen.getByLabelText(/password/i), DEMO_USER.password);
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/tasks'));
    expect(await screen.findByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
  });
});
