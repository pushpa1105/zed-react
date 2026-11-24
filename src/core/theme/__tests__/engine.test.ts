import { DEFAULT_THEME } from '../config';
import { applyTheme, getContrastForeground, resolveMode } from '../engine';

describe('theme engine', () => {
  it('picks a readable foreground for a background color', () => {
    expect(getContrastForeground('#ffffff')).toBe('oklch(0.145 0 0)');
    expect(getContrastForeground('#000')).toBe('oklch(0.985 0 0)');
    expect(getContrastForeground('#1d4ed8')).toBe('oklch(0.985 0 0)');
  });

  it('resolves "system" from the OS preference', () => {
    expect(resolveMode('dark')).toBe('dark');
    expect(resolveMode('system')).toBe('light'); // matchMedia is mocked to false
  });

  it('writes the theme to the root element', () => {
    const root = document.createElement('html');

    applyTheme(
      {
        ...DEFAULT_THEME,
        mode: 'dark',
        preset: 'violet',
        font: 'serif',
        scale: 'lg',
        radius: 1,
        customPrimary: '#ff0000',
      },
      root,
    );

    expect(root).toHaveClass('dark');
    expect(root.dataset.theme).toBe('violet');
    expect(root.dataset.font).toBe('serif');
    expect(root.dataset.scale).toBe('lg');
    expect(root.style.getPropertyValue('--radius')).toBe('1rem');
    expect(root.style.getPropertyValue('--primary')).toBe('#ff0000');
  });

  it('removes the custom primary when it is cleared', () => {
    const root = document.createElement('html');
    applyTheme({ ...DEFAULT_THEME, customPrimary: '#ff0000' }, root);
    applyTheme({ ...DEFAULT_THEME, customPrimary: null }, root);

    expect(root.style.getPropertyValue('--primary')).toBe('');
    expect(root).not.toHaveClass('dark');
  });
});
