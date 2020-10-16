import React from "react";
import { auth, authServices } from "../Firebase/services";
import {
  Button,
  Card,
  Stepper,
  StepLabel,
  StepContent,
  Typography,
  Step,
  ButtonGroup,
  TextField,
  Snackbar,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Helmet from "react-helmet";
import { LoaderContext } from "../Navbar/Loader";
export default (): JSX.Element => {
  const steps = ["Choose the method of signing in", "Fill out the details"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [provider, setProviderName] = React.useState<"google" | "email" | null>(
    null
  );
  const [snackBarOpen, setSnackBar] = React.useState(false);
  const [snackBarContent, setSnackBarContent] = React.useState<string>("");
  const [email, setEmail] = React.useState("");
  const [displayName, setdisplayName] = React.useState("");
  const [comingFromEmail, setComingFromEmail] = React.useState(
    auth.isSignInWithEmailLink(window.location.href)
  );
  const [userStatus, setUserStatus] = React.useState("");
  const history = useHistory();
  const {
    sendSignInLinkToEmail,
    signInWithGoogle,
    finalizeEmailSignIn,
    signInWithEmailLink,
  } = authServices();
  const openSnackBar = (content: string) => {
    setSnackBarContent(content);
    setSnackBar(true);
  };
  const closeSnackBar = () => {
    setSnackBarContent("");
    setSnackBar(false);
  };
  const setProvider = (newProvider: "google" | "email") => {
    if (newProvider === provider) {
      setProviderName(null);
      //@ts-ignore : supress ts errors
      providerButtonRefs[newProvider].current.classList.toggle(
        "MuiButton-containedSecondary"
      );
      return;
    }
    setProviderName(newProvider);
    const otherProvider = newProvider === "google" ? "email" : "google";
    if (providerButtonRefs[newProvider].current) {
      // @ts-ignore : supress ts errors
      providerButtonRefs[newProvider].current.classList.toggle(
        "MuiButton-containedSecondary"
      );
      //@ts-ignore : supress ts errors
      providerButtonRefs[otherProvider].current.classList.remove(
        "MuiButton-containedSecondary"
      );
    }
  };
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ButtonGroup
            variant="outlined"
            color="secondary"
            orientation="vertical"
          >
            {/*
            // @ts-ignore */}
            <Button
              ref={providerButtonRefs.google}
              onClick={() => {
                setProvider("google");
              }}
            >
              Sign in with Google
            </Button>
            {/*
            // @ts-ignore */}
            <Button
              ref={providerButtonRefs.email}
              onClick={() => {
                setProvider("email");
              }}
            >
              Sign in with email
            </Button>
          </ButtonGroup>
        );
      case 1:
        if (provider === "google")
          return (
            <Button
              onClick={() => signInWithGoogle(history, openSnackBar)}
              variant="outlined"
              color="secondary"
            >
              Click me to sign in with Google
            </Button>
          );
        else
          return (
            <>
              <TextField
                variant="standard"
                type="email"
                label="Enter your email"
                color="secondary"
                value={email}
                onChange={(evt) => setEmail(evt.target.value)}
              ></TextField>
              <br />
              <br />
              <Button
                onClick={() => sendSignInLinkToEmail(email, openSnackBar)}
                variant="outlined"
                color="secondary"
              >
                Submit
              </Button>
            </>
          );
      default:
        return <></>;
    }
  };
  const providerButtonRefs = {
    google: React.useRef<HTMLButtonElement>(),
    email: React.useRef<HTMLButtonElement>(),
  };
  const loader = React.useContext(LoaderContext);
  React.useEffect(() => {
    // stop the loader on the first time
    // If we don't do this, loader won't show up
    if (navigator.userAgent !== "ReactSnap") loader.stop();
  }, []);
  if (userStatus === "oldUser" && auth.currentUser?.displayName)
    return <>{history.push("/")}</>;
  if (comingFromEmail) {
    (async () => {
      if (userStatus === "") {
        setUserStatus(await signInWithEmailLink());
      }
    })();
    if (userStatus === "oldUser") return <div>Loading</div>;
    if (auth && auth.currentUser && !auth.currentUser.displayName)
      return (
        <div>
          <Helmet>
            <title>Lookahead - Just one more step!!</title>
          </Helmet>
          <Card style={{ paddingLeft: "1em" }}>
            <Typography variant="h2">Just one more step!!</Typography>
            <TextField
              variant="standard"
              type="text"
              label="Enter your good name"
              color="secondary"
              value={displayName}
              onChange={(evt) => setdisplayName(evt.target.value)}
            ></TextField>
            {"\n\n"}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() =>
                finalizeEmailSignIn(displayName, history, openSnackBar)
              }
            >
              Start using this app
            </Button>
          </Card>
        </div>
      );
  } else
    return (
      <div>
        <Helmet>
          <title>Lookahead - Sign in</title>
        </Helmet>
        <Card>
          <Typography variant="h2">Sign in to go ahead!!</Typography>
          <Stepper orientation="vertical" activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={index} id={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>{getStepContent(index)}</StepContent>
              </Step>
            ))}
          </Stepper>
          <Button
            disabled={activeStep === 1 || !provider}
            onClick={() => setActiveStep(activeStep + 1)}
          >
            Next
          </Button>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
          >
            Back
          </Button>
        </Card>
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
          open={snackBarOpen}
          autoHideDuration={4000}
          message={snackBarContent}
          action={
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => closeSnackBar()}
            >
              Ok
            </Button>
          }
        ></Snackbar>
      </div>
    );
  return <></>;
};
