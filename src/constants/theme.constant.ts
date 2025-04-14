import {colors as baseColors} from './style.constant';

// Defines the structure for a theme palette, specifying the names
// and types of colors used throughout the application.
export interface ThemePalette {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  link: string;
  error: string;
  success: string;
  textSubtle: string;
  icon: string;
  inputBackground: string;
  inputPlaceholder: string;
  statusPendingBg: string;
  statusPendingText: string;
  statusSuccessBg: string;
  statusSuccessText: string;
  divider: string;
}

// Light theme palette configuration.
// Maps semantic color names (e.g., 'primary', 'background') to specific color values.
// It utilizes base colors defined in './style.constant' where appropriate.
export const lightTheme: ThemePalette = {
  primary: baseColors.orange.base, // Use existing orange
  secondary: baseColors.green.base, // Use existing green
  background: '#f7f9f8',
  card: '#FFFFFF', // Card seems same as background in light mode
  text: '#1C1C1E',
  textSecondary: baseColors.gray.dark, // Use base gray
  border: baseColors.gray.medium, // Use base gray
  link: '#007AFF',
  error: '#FF3B30',
  success: baseColors.green.status, // Use status green

  // New/Updated
  textSubtle: '#8A8A8E', // Lighter gray for dates
  icon: baseColors.gray.dark,
  inputBackground: baseColors.gray.light,
  inputPlaceholder: baseColors.gray.mediumDark,
  statusPendingBg: '#FFF3E0', // Light orange background
  statusPendingText: baseColors.orange.status,
  statusSuccessBg: '#E8F5E9', // Light green background
  statusSuccessText: baseColors.green.status,
  divider: baseColors.gray.light,
};

// Dark theme palette configuration.
// Provides alternative color values suitable for a dark user interface.
// It also utilizes base colors from './style.constant'.
export const darkTheme: ThemePalette = {
  primary: baseColors.orange.base,
  secondary: baseColors.green.base,
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#3A3A3C',
  link: '#0A84FF',
  error: '#FF453A',
  success: baseColors.green.status,

  // New/Updated (Provide sensible dark theme equivalents)
  textSubtle: '#8E8E93',
  icon: '#8E8E93',
  inputBackground: '#2C2C2E',
  statusPendingBg: '#4A2A00', // Darker orange background
  statusPendingText: '#FF9500',
  statusSuccessBg: '#0A3D14', // Darker green background
  statusSuccessText: '#30D158',
  divider: '#2C2C2E',
  inputPlaceholder: '#8E8E93',
};

// Exports the type definition for a theme, deriving it from the lightTheme object.
// This ensures any theme object conforms to the structure of lightTheme.
export type Theme = typeof lightTheme;
// Exports a union type representing the possible theme names.
export type ThemeType = 'light' | 'dark';
