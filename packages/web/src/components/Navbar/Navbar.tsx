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
import { authServices } from "../Firebase/services";
import { Link } from "react-router-dom";
const AccountPopover = React.lazy(() => import("./AccountPopover"));
interface Props {
  themeChanger: Function;
  historyHook: import("history").History;
  themeHook: {
    theme: ThemeOptions;
    themeName: string;
  };
}
export default (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [popoverBtnEl, setPopoverBtnEl] = React.useState<null | HTMLLIElement>(
    null
  );
  const [photoURL, setPhotoURL] = React.useState("");
  const { signOut, useAuth } = authServices();
  const currentUser = useAuth();
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
          {props.themeHook.themeName === "light" &&
          /* Prerendering messes up icons */
          navigator.userAgent !== "ReactSnap" ? (
            <Brightness2 />
          ) : (
            <BrightnessHigh />
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
          {/* make react-snap happy */}
          <Link to="/signin" hidden />
          <MenuItem onClick={handlePopoverBtnClick}>Account</MenuItem>
          <React.Suspense fallback={<></>}>
            <AccountPopover
              handleClose={handlePopoverBtnClose}
              anchorEl={popoverBtnEl}
              open={popoverOpen}
            />
          </React.Suspense>
          <Authenticated
            noAuth={
              <MenuItem onClick={() => goToSignInPage()}>Sign In</MenuItem>
            }
          >
            <MenuItem onClick={() => signOut(props.historyHook)}>
              Sign Out
            </MenuItem>
          </Authenticated>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
