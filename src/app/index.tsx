import {ThemeProvider} from '../store/theme.store';
import Navigation from './navigator.app';

export default function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}
