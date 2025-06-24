import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from './themeStore';

// Mock window.matchMedia for consistent test results
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: dark)', // Mock system preference to dark
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useThemeStore', () => {
  beforeEach(() => {
    // Reset to initial state before each test. The persist middleware uses localStorage.
    useThemeStore.setState(useThemeStore.getInitialState());
    vi.clearAllMocks();
  });

  it('should initialize with "system" as the default theme', () => {
    expect(useThemeStore.getState().theme).toBe('system');
  });

  it('should set theme to dark when initializeTheme is called and system preference is dark', () => {
    // Initial state is 'system'
    expect(useThemeStore.getState().theme).toBe('system');

    // Initialize theme based on mocked system preference
    useThemeStore.getState().initializeTheme();
    
    // Expect theme to be 'dark' because of the mock
    expect(useThemeStore.getState().theme).toBe('dark');
  });

  it('should not change theme on initialization if it is not "system"', () => {
    // Manually set the theme to 'light'
    useThemeStore.getState().setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');

    // Attempt to initialize
    useThemeStore.getState().initializeTheme();

    // Theme should remain 'light'
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should allow directly setting the theme to light, dark, or system', () => {
    useThemeStore.getState().setTheme('light');
    expect(useThemeStore.getState().theme).toBe('light');

    useThemeStore.getState().setTheme('dark');
    expect(useThemeStore.getState().theme).toBe('dark');

    useThemeStore.getState().setTheme('system');
    expect(useThemeStore.getState().theme).toBe('system');
  });
}); 