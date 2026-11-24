import { act } from '@testing-library/react';

import { DEFAULT_THEME, THEME_STORAGE_KEY } from '../config';
import { useThemeStore } from '../store';

describe('theme store', () => {
  beforeEach(() => act(() => useThemeStore.getState().reset()));

  it('updates and persists preferences', () => {
    act(() => {
      useThemeStore.getState().setMode('dark');
      useThemeStore.getState().setPreset('green');
      useThemeStore.getState().setRadius(0.3);
    });

    const state = useThemeStore.getState();
    expect(state).toMatchObject({ mode: 'dark', preset: 'green', radius: 0.3 });

    const persisted = JSON.parse(window.localStorage.getItem(THEME_STORAGE_KEY)!);
    expect(persisted.state).toMatchObject({ mode: 'dark', preset: 'green', radius: 0.3 });
  });

  it('clears the custom color when a preset is chosen', () => {
    act(() => useThemeStore.getState().setCustomPrimary('#123456'));
    expect(useThemeStore.getState().customPrimary).toBe('#123456');

    act(() => useThemeStore.getState().setPreset('rose'));
    expect(useThemeStore.getState().customPrimary).toBeNull();
  });

  it('resets to defaults', () => {
    act(() => {
      useThemeStore.getState().setFont('mono');
      useThemeStore.getState().reset();
    });
    expect(useThemeStore.getState()).toMatchObject(DEFAULT_THEME);
  });
});
