import React from "react";
import {
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  ThemeOptions,
  Menu,
  MenuItem,
  Avatar,
} from "@material-ui/core";
import { AccountCircle, Brightness2, BrightnessHigh } from "@material-ui/icons";
import Authenticated from "../Firebase/Authenticated";
import { authServices, useIsSignedIn } from "../Firebase/services";
import { NextRouter } from "next/router";
import dynamic from "next/dynamic";
import firebase from "firebase/app";
import "firebase/auth";
import isBrowser from "../util/isBrowser";
const AccountPopover = dynamic(() => import("./AccountPopover"), {
  ssr: false,
});
interface Props {
  themeChanger: Function;
  historyHook: NextRouter;
  themeHook: {
    theme: ThemeOptions;
    themeName: string;
  };
}

const Navbar = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [popoverBtnEl, setPopoverBtnEl] = React.useState<null | HTMLLIElement>(
    null
  );
  const [photoURL, setPhotoURL] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState<firebase.User | null>(
    firebase.auth().currentUser
  );
  firebase.auth().onAuthStateChanged((user) => {
    setCurrentUser(user);
  });
  const goToSignInPage = () => props.historyHook.push("/signin");
  const handleAvatarBtnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlePopoverBtnClick = (event: React.MouseEvent<HTMLLIElement>) => {
    setPopoverBtnEl(event.currentTarget);
  };

  const handlePopoverBtnClose = () => {
    setPopoverBtnEl(null);
  };
  const signOut = async () => {
    try {
      window.localStorage.setItem("isSignedIn", "false");
      await firebase.auth().signOut();
      await props.historyHook.push("/");
      window.location.reload();
    } catch (e) {
      throw e;
    }
  };
  const popoverOpen = Boolean(popoverBtnEl);
  const photoURLInterval = setInterval(() => {
    if (currentUser && currentUser.photoURL) {
      setPhotoURL(currentUser.photoURL);
      clearInterval(photoURLInterval);
      return;
    }
  });
  return (
    <AppBar position="fixed">
      <Toolbar variant="regular">
        <Typography variant="body1">Lookahead</Typography>
        <span className="spacer" style={{ flex: "1 1 auto" }}></span>
        <IconButton
          onClick={() => props.themeChanger()}
          color="inherit"
          component="span"
        >
          {isBrowser() ? (
            props.themeHook.themeName === "light" ? (
              <Brightness2 />
            ) : (
              <BrightnessHigh />
            )
          ) : (
            ""
          )}
        </IconButton>
        <IconButton
          onClick={handleAvatarBtnClick}
          color="inherit"
          component="span"
        >
          <Authenticated noAuth={<AccountCircle />}>
            {photoURL ? (
              <Avatar
                variant="circle"
                src={photoURL}
                alt={currentUser?.displayName || "Current User"}
              />
            ) : (
              <Avatar>
                <AccountCircle color="secondary" />
              </Avatar>
            )}
          </Authenticated>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handlePopoverBtnClick}>Account</MenuItem>
          <AccountPopover
            handleClose={handlePopoverBtnClose}
            anchorEl={popoverBtnEl}
            open={popoverOpen}
          />
          <Authenticated
            noAuth={
              <MenuItem onClick={() => goToSignInPage()}>Sign In</MenuItem>
            }
          >
            <MenuItem onClick={signOut}>Sign Out</MenuItem>
          </Authenticated>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
