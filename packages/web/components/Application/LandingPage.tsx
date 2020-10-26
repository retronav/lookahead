import React from "react";
import {
  createStyles,
  makeStyles,
  Typography,
  useMediaQuery,
  Button,
} from "@material-ui/core";
import Link from "next/link";
import { LoaderContext } from "../Navbar/Loader";
import Head from "next/head";
import isBrowser from "../util/isBrowser";
import { useRouter } from "next/router";
import { authServices } from "../Firebase/services";
const useStyles = makeStyles((theme) =>
  createStyles({
    parentDiv: {
      color: theme.palette.getContrastText(theme.palette.primary.dark),
      backgroundColor: theme.palette.primary.dark,
      minHeight: `calc(100vh - 64px)`,
      width: "100vw",
      overflowX: "hidden",
    },
    "@media(max-height: 576px)": {
      paper: {
        height: `calc(100vh - 56px)`,
      },
    },
    title: {
      paddingTop: theme.spacing(10),
      fontWeight: "bold",
    },
    featuresListItem: {
      margin: 0,
      width: "100%",
      textAlign: "center",
    },
  })
);
export default function LandingPage() {
  if (isBrowser()) {
    const currentUser = authServices().useAuth();
    if (currentUser) {
      useRouter().push("/app");
    }
  }
  const classes = useStyles();
  const isSmallerThanMD = useMediaQuery("(max-height : 768px)");
  const loader = React.useContext(LoaderContext);
  React.useEffect(() => {
    // stop the loader on the first time
    // If we don't do this, loader won't show up
    loader.stop();
  }, []);
  return (
    <>
      <div className={classes.parentDiv}>
        <Head>
          <title>Lookahead</title>
          <meta
            name="description"
            content={
              "The fast, beautiful to-do and notes app for everyone. Keep the stuff" +
              "with us, and now you can look ahead on what's next to come. " +
              "The app is a fast, beatuiful, minimal store for your to-dos and notes."
            }
          />
        </Head>
        <div>
          <Typography
            className={classes.title}
            gutterBottom
            align="center"
            variant={isSmallerThanMD ? "h2" : "h1"}
          >
            This is Lookahead.
          </Typography>
          <Typography align="center" variant="subtitle1">
            The fast, beautiful to-do and notes app for everyone. Keep the stuff
            with us, and now you can look ahead on what's next to come.
          </Typography>
        </div>
        <p className="spacer" style={{ paddingTop: 20 }}></p>
        <div>
          <Typography align="center" variant="h4">
            Features
          </Typography>
          <div>
            <p className={classes.featuresListItem}>Fast & free of cost</p>
            <p className={classes.featuresListItem}>Installable (as a PWA)</p>
            <p className={classes.featuresListItem}>Cross Browser</p>
            <p className={classes.featuresListItem}>
              Notifications for reminders(coming soon!)
            </p>
            <p className={classes.featuresListItem}>
              CLI Application(coming soon!)
            </p>
            <p style={{ textAlign: "center" }}>
              <Button variant="contained" color="secondary">
                <Link href="/signin">
                  <a style={{ textDecoration: "none", color: "inherit" }}>
                    Sign in to start using
                  </a>
                </Link>
              </Button>
            </p>
          </div>
        </div>
        <p style={{ textAlign: "center", marginBottom: 0 }}>
          <small>
            With love, by{" "}
            <a
              style={{ textDecoration: "none", color: "inherit" }}
              href="https://github.com/obnoxiousnerd"
            >
              <b>Pranav Karawale</b>
            </a>
            , 2020-present
          </small>
        </p>
      </div>
    </>
  );
}
