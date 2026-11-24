import { act, renderWithProviders, screen } from '@/testing/test-utils';

import { ThemeCustomizer } from '../components/theme-customizer';
import { useThemeStore } from '../store';

describe('ThemeCustomizer', () => {
  beforeEach(() => act(() => useThemeStore.getState().reset()));

  it('changes mode, preset, radius and font', async () => {
    const { userEvent } = await renderWithProviders(<ThemeCustomizer />);

    await userEvent.click(screen.getByRole('button', { name: /dark/i }));
    await userEvent.click(screen.getByRole('button', { name: /violet/i }));
    await userEvent.click(screen.getByRole('button', { name: '1' }));
    await userEvent.click(screen.getByRole('button', { name: /serif/i }));

    expect(useThemeStore.getState()).toMatchObject({
      mode: 'dark',
      preset: 'violet',
      radius: 1,
      font: 'serif',
    });
    expect(screen.getByRole('button', { name: /violet/i })).toHaveAttribute('aria-pressed', 'true');
  });

  it('resets to defaults', async () => {
    const { userEvent } = await renderWithProviders(<ThemeCustomizer />);
    await userEvent.click(screen.getByRole('button', { name: /rose/i }));
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    expect(useThemeStore.getState().preset).toBe('neutral');
  });
});
