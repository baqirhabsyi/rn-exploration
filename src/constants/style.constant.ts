/**
 * Defines the color palette used throughout the application.
 */
export const colors = {
  orange: {
    base: '#fc6444', // Primary orange color.
    status: '#F57D00', // Orange color specifically for status indicators (like pending).
  },
  green: {
    base: '#53b685', // Primary green color.
    status: '#4CAF50', // Green color specifically for status indicators (like success).
  },
  gray: {
    extraLight: '#F9F9F9', // Very light gray, often for backgrounds.
    light: '#F6F6F6', // Light gray.
    medium: '#E0E0E0', // Medium gray, often for borders or dividers.
    mediumDark: '#AEAEB2', // Medium-dark gray.
    dark: '#6E6E72', // Dark gray, often for secondary text.
    extraDark: '#3A3A3C', // Very dark gray, often for primary text.
  },
};

/**
 * Defines a spacing scale for margins, paddings, and gaps.
 * Uses a consistent scale for visual harmony.
 */
export const scale = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

/**
 * Defines standard font sizes used in the application.
 */
export const fontSizes = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

/**
 * Defines standard border radius values for creating rounded corners.
 */
export const radius = {
  xxs: 1,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 32,
  full: 9999, // A large value to create circular elements.
};
