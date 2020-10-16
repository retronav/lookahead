import React from "react";
import "./App.css";
import {
  ThemeProvider,
  createMuiTheme,
  Paper,
  makeStyles,
  CssBaseline,
  createStyles,
} from "@material-ui/core";
import { lightTheme, darkTheme, toggleMode } from "./themes";
import Navbar from "./components/Navbar/Navbar";
import Authenticated from "./components/Firebase/Authenticated";
import { Route, Switch, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { SnackbarProvider } from "notistack";
import SWWrapper from "./SWWrapper";
import { LoaderContext, Loader } from "./components/Navbar/Loader";
import LazyLoader from "./components/Application/LazyLoader";
const Application = React.lazy(
  () => import("./components/Application/Application")
);
const SignIn = React.lazy(() => import("./components/SignIn/SignIn"));
const LandingPage = React.lazy(
  () => import("./components/Application/LandingPage")
);
const styles = makeStyles((theme) =>
  createStyles({
    paper: {
      minHeight: `calc(100vh - 64px)`,
      width: "100vw",
    },
    "@media(max-height: 576px)": {
      paper: {
        height: `calc(100vh - 56px)`,
      },
    },
    appbar: theme.mixins.toolbar,
  })
);
const useLoader = () => {
  const [loaderState, setLoaderState] = React.useState(true);
  return {
    loaderState,
    start: () => setLoaderState(true),
    stop: () => setLoaderState(false),
  };
};
function App() {
  const classes = styles();
  const historyHook = useHistory();
  const [theme, setTheme] = React.useState({
    theme: window.localStorage.getItem("themeName")
      ? window.localStorage.getItem("themeName") === "light"
        ? lightTheme
        : darkTheme
      : lightTheme,
    themeName: window.localStorage.getItem("themeName") || "light",
  });
  const loaderStuff = useLoader();

  return (
    <ThemeProvider theme={createMuiTheme(theme.theme)}>
      <SnackbarProvider>
        <CssBaseline>
          {process.env.NODE_ENV === "production" && <SWWrapper />}
          <Helmet>
            <meta
              name="theme-color"
              content={
                //@ts-ignore
                theme.theme.palette.primary[500] || ""
              }
            />
          </Helmet>
          <div className={classes.appbar}></div>
          <LoaderContext.Provider value={loaderStuff}>
            <Navbar
              historyHook={historyHook}
              themeHook={theme}
              themeChanger={() => {
                toggleMode(theme, setTheme);
              }}
            ></Navbar>
            <Loader />
            <Paper className={classes.paper}>
              <Switch>
                <Route path="/signin">
                  <React.Suspense fallback={<LazyLoader />}>
                    <SignIn />
                  </React.Suspense>
                </Route>
                <Route path="/">
                  {navigator.userAgent !== "reactSnap" && (
                    <Authenticated
                      noAuth={
                        <React.Suspense fallback={<LazyLoader />}>
                          <LandingPage />
                        </React.Suspense>
                      }
                    >
                      <React.Suspense fallback={<LazyLoader />}>
                        <Application />
                      </React.Suspense>
                    </Authenticated>
                  )}
                </Route>
              </Switch>
            </Paper>
          </LoaderContext.Provider>
        </CssBaseline>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
