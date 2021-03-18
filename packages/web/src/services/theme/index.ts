import { getSettings, setTheme as setSettingsTheme } from '../settings';
export type ThemeType = 'dark' | 'light';

export interface ThemeOptions {
  /** The theme primary color */
  primary: string;
  /** The theme secondary color */
  secondary: string;
  /** The theme surface color */
  surface: string;
  /** The theme background color */
  background: string;
  /** Text and icons on top of a theme primary color background */
  textPrimary: string;
  /** Text and icons on top of a theme secondary color background. */
  textSecondary: string;
  /** Text and icons on top of a theme surface color background. */
  textSurface: string;
  /** Font family string */
  fontFamily: string;
  buttonDisabledFillColor: string;
  buttonDisabledTextColor: string;
  buttonDisabledOutlineColor: string;
}

const themeMap: ThemeOptions = {
  primary: '--mdc-theme-primary',
  secondary: '--mdc-theme-secondary',
  surface: '--mdc-theme-surface',
  background: '--mdc-theme-background',
  textPrimary: '--mdc-theme-on-primary',
  textSecondary: '--mdc-theme-on-secondary',
  textSurface: '--mdc-theme-on-surface',
  fontFamily: '--mdc-typography-font-family',
  buttonDisabledFillColor: '--mdc-button-disabled-fill-color',
  buttonDisabledOutlineColor: '--mdc-button-disabled-outline-color',
  buttonDisabledTextColor: '--mdc-button-disabled-ink-color',
};
const rootElement = document.querySelector('html') as HTMLElement;

export function getTheme() {
  const theme: Partial<ThemeOptions> = {};
  Object.keys(themeMap).map((key) => {
    //@ts-ignore : TS won't let me to set properties via string keys
    theme[key] = rootElement.style.getPropertyValue(themeMap[key]);
  });
  return theme;
}

function setTheme(theme: Partial<ThemeOptions>) {
  const bodyElement = document.body;
  //Save initial transition state
  const initialTransitionState = bodyElement.style.transition;
  // Color change transition
  bodyElement.style.setProperty('transition', 'color, background 0.1s ease');
  Object.keys(themeMap).map((key) => {
    //@ts-ignore : TS won't let me to set properties via string keys
    if (theme[key]) rootElement.style.setProperty(themeMap[key], theme[key]);
  });
  // Set transition to initial state
  setTimeout(() => {
    if (initialTransitionState)
      bodyElement.style.setProperty('transition', initialTransitionState);
    else bodyElement.style.removeProperty('transition');
  }, 200);
}

type withColorsOptions = Partial<ThemeOptions> & { primary: string };

export function withColors(opts: withColorsOptions) {
  return function (target: Partial<ThemeOptions>) {
    Object.keys(opts).forEach((key) => {
      //@ts-ignore: String index is allowed in this case
      if (opts[key]) target[key] = opts[key];
    });
    return target;
  };
}

const baseTheme: ThemeOptions = {
  fontFamily: `Fira Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  primary: '#6200ee',
  secondary: '#018786',
  surface: '#ffffff',
  background: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#ffffff',
  textSurface: '#000000',
  buttonDisabledFillColor: '#aaaaaa',
  buttonDisabledOutlineColor: '#aaaaaa',
  buttonDisabledTextColor: '#aaaaaa',
};

export function setDarkTheme() {
  const theme = withColors({
    primary: '#424242',
    secondary: '#00bfa5',
    surface: '#202020',
    background: '#202020',
    textPrimary: '#ffffff',
    textSecondary: '#000000',
    textSurface: '#ffffff',
  })(baseTheme);
  setTheme(theme);
}
export function setLightTheme() {
  const theme = withColors({
    primary: '#6200ee',
    secondary: '#018786',
    surface: '#ffffff',
    background: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#ffffff',
    textSurface: '#000000',
  })(baseTheme);
  setTheme(theme);
}

export function getThemeType(): ThemeType | null {
  const surfaceColor = rootElement.style.getPropertyValue(themeMap.surface);
  if (surfaceColor) return surfaceColor === '#ffffff' ? 'light' : 'dark';
  else return null;
}

/**
 * Set the theme initially, before render.
 * For usage see components/app-navbar.ts
 */
export async function setInitalTheme() {
  const settings = await getSettings();
  const theme = await settings.theme;
  if (!theme) {
    await setSettingsTheme('dark');
    setDarkTheme();
  } else {
    theme === 'dark' ? setDarkTheme() : setLightTheme();
  }
}