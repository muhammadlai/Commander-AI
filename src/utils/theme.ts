import { ThemeMode, AccentColor } from '../types';
import { APP_CONFIG } from '../config/appConfig';

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  
  if (theme === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (systemPrefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } else if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function applyAccentColor(accent: AccentColor) {
  const accentObj = APP_CONFIG.accents.find(a => a.id === accent) || APP_CONFIG.accents[0];
  const root = document.documentElement;
  root.style.setProperty('--color-accent', accentObj.primary);
  root.style.setProperty('--color-accent-glow', accentObj.glow);
}
