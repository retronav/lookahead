import {
  createMuiTheme,
  createStyles,
  CssBaseline,
  makeStyles,
  Paper,
  ThemeProvider,
} from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { darkTheme, lightTheme, toggleMode } from "../components/themes";
import SWWrapper from "../components/SWWrapper";
import Navbar from "../components/Navbar/Navbar";
import * as React from "react";
import "../styles/globals.css";
import { useRouter } from "next/router";
import isBrowser from "../components/util/isBrowser";
import { Loader, LoaderContext } from "../components/Navbar/Loader";
import Head from "next/head";

const styles = makeStyles((theme) =>
  createStyles({
    paper: {
      minHeight: `calc(100vh - 64px)`,
      width: "100vw",
    },
    "@media(max-height: 576px)": {
      paper: {
        minHeight: `calc(100vh - 56px)`,
      },
    },
    appbar: theme.mixins.toolbar,
  })
);

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);
  const classes = styles();
  const useLoader = () => {
    const [loaderState, setLoaderState] = React.useState(true);
    return {
      loaderState,
      start: () => setLoaderState(true),
      stop: () => setLoaderState(false),
    };
  };
  const loaderStuff = useLoader();
  const [theme, setTheme] = React.useState({
    theme:
      isBrowser() && window.localStorage.getItem("themeName")
        ? window.localStorage.getItem("themeName") === "light"
          ? lightTheme
          : darkTheme
        : lightTheme,
    themeName:
      (isBrowser() && window.localStorage.getItem("themeName")) || "light",
  });
  //Firebase Analytics and Performance Monitoring
  import("../components/util/analytics-perf");
  return (
    <>
      <ThemeProvider theme={createMuiTheme(theme.theme)}>
        <SnackbarProvider>
          <LoaderContext.Provider value={loaderStuff}>
            <CssBaseline />
            <div className={classes.appbar}></div>
            {isBrowser() && (
              <Head>
                <meta
                  name="theme-color"
                  content={
                    //@ts-ignore
                    theme.theme.palette.primary[500] || ""
                  }
                />
              </Head>
            )}
            <Navbar
              historyHook={useRouter()}
              themeHook={theme}
              themeChanger={() => {
                toggleMode(theme, setTheme);
              }}
            ></Navbar>
            <Loader />
            {process.env.NODE_ENV === "production" && isBrowser() && (
              <SWWrapper />
            )}
            <Paper className={classes.paper}>
              <Component {...pageProps} />
            </Paper>
          </LoaderContext.Provider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export function reportWebVitals(metric) {
  console.log(metric);
}

export default MyApp;
