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

interface withColorsOptions {
  primary: string;
  secondary?: string;
  surface?: string;
  background?: string;
  textPrimary?: string;
  textSecondary?: string;
  textSurface?: string;
}

export function withColors({
  primary,
  secondary,
  surface,
  background,
  textPrimary,
  textSecondary,
  textSurface,
}: withColorsOptions) {
  return function (target: Partial<ThemeOptions>) {
    target.primary = primary;
    if (secondary) target.secondary = secondary;
    if (surface) target.surface = surface;
    if (background) target.background = background;
    if (textPrimary) target.textPrimary = textPrimary;
    if (textSecondary) target.textSecondary = textSecondary;
    if (textSurface) target.textSurface = textSurface;
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

export function getThemeType(): 'dark' | 'light' {
  const surfaceColor = rootElement.style.getPropertyValue(themeMap.surface);
  return surfaceColor === '#ffffff' ? 'light' : 'dark';
}
