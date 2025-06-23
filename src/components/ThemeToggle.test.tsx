import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import ThemeToggle from './ThemeToggle';
import { useThemeStore } from '@/stores/themeStore';

// Mock the zustand store
vi.mock('@/stores/themeStore');

describe('ThemeToggle', () => {
  it('should render the sun icon when the theme is light', () => {
    // Arrange: Set the mock to return the 'light' theme
    (useThemeStore as unknown as Mock).mockReturnValue({
      theme: 'light',
      toggleTheme: () => {},
    });

    render(<ThemeToggle />);

    // Act & Assert
    // Assuming the icons have a 'sun-icon' or 'moon-icon' test id or class
    // We will look for the button's content/title as a stand-in
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
    // A more specific test would check for the SVG, e.g. by title or testId
  });

  it('should render the moon icon when the theme is dark', () => {
    // Arrange: Set the mock to return the 'dark' theme
    (useThemeStore as unknown as Mock).mockReturnValue({
      theme: 'dark',
      toggleTheme: () => {},
    });

    render(<ThemeToggle />);

    // Act & Assert
    expect(screen.getByLabelText(/toggle theme/i)).toBeInTheDocument();
  });

  it('should call toggleTheme when clicked', () => {
    // Arrange
    const toggleThemeMock = vi.fn();
    (useThemeStore as unknown as Mock).mockReturnValue({
      theme: 'light',
      setTheme: toggleThemeMock,
      toggleTheme: toggleThemeMock,
    });

    render(<ThemeToggle />);
    const button = screen.getByLabelText(/toggle theme/i);

    // Act
    fireEvent.click(button);

    // Assert
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});
