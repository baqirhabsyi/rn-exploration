import {ThemeProvider} from '../store/theme.store';
import Navigation from './navigator.app';

/**
 * The main entry point component for the application.
 * It sets up the theme provider and renders the main navigation structure.
 */
export default function App() {
  return (
    // Provides the theme context to the entire application.
    <ThemeProvider>
      {/* Renders the main navigation container and screens. */}
      <Navigation />
    </ThemeProvider>
  );
}
