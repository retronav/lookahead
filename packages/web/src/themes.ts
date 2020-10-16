import { teal, grey, blue, deepPurple } from "@material-ui/core/colors";
import { ThemeOptions } from "@material-ui/core";
export const lightTheme: ThemeOptions = {
  palette: {
    type: "light",
    primary: blue,
    secondary: deepPurple,
  },
  typography: {
    fontFamily: `"Fira Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif`,
  },
};
export const darkTheme: ThemeOptions = {
  palette: {
    type: "dark",
    primary: grey,
    secondary: teal,
  },
  typography: {
    fontFamily: `"Fira Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
      "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif`,
  },
};
export const toggleMode = (
  theme: {
    theme: ThemeOptions;
    themeName: string;
  },
  setTheme: React.Dispatch<
    React.SetStateAction<{
      theme: ThemeOptions;
      themeName: string;
    }>
  >
) => {
  setTheme({
    theme: theme.themeName === "light" ? darkTheme : lightTheme,
    themeName: theme.themeName === "light" ? "dark" : "light",
  });
  localStorage.setItem(
    "themeName",
    theme.themeName === "light" ? "dark" : "light"
  );
};
