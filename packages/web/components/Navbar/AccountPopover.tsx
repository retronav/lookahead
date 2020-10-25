import React from "react";
import {
  Avatar,
  Card,
  makeStyles,
  Popover,
  Typography,
  Button,
  CardContent,
  IconButton,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { authServices } from "../Firebase/services";
import { Create } from "@material-ui/icons";
import EditAccountDetails from "./EditAccountDetails";
interface Props {
  anchorEl: HTMLLIElement | null;
  open: boolean;
  handleClose: () => void;
}

const AccountPopover = (props: Props) => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const user = authServices().useAuth();
  const [photoURL, setPhotoURL] = React.useState(user?.photoURL);
  const [displayName, setDisplayName] = React.useState(user?.displayName);
  const detailsInterval = setInterval(() => {
    if (user && user.photoURL && user.displayName) {
      setPhotoURL(user.photoURL);
      setDisplayName(user.displayName);
      clearInterval(detailsInterval);
      return;
    }
  });
  setInterval(() => {
    if (user && user.photoURL !== photoURL) setPhotoURL(user.photoURL);
    if (user && user.displayName !== displayName)
      setDisplayName(user.displayName);
  }, 500);
  const history = useRouter();
  return (
    <Popover
      open={props.open}
      anchorEl={props.anchorEl}
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {user ? (
        <Card
          style={{
            width: "50vw",
            textAlign: "center",
          }}
        >
          <EditAccountDetails
            open={openEdit}
            onClose={() => setOpenEdit(false)}
          />
          <p style={{ textAlign: "right", margin: 0 }}>
            <IconButton onClick={() => setOpenEdit(true)}>
              <Create />
            </IconButton>
          </p>
          <CardContent>
            <img
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                width: "80px",
                height: "80px",
                borderRadius: "40px",
              }}
              src={photoURL || ""}
              alt={displayName || ""}
            />
            <Typography variant="h5">
              {displayName || "You haven't set a name"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card style={{ width: "50vw", padding: "0.75em", textAlign: "center" }}>
          <Typography variant="h5">You are not logged in</Typography>
          <Button
            onClick={() => history.push("/signin")}
            variant="outlined"
            color="secondary"
          >
            Sign in
          </Button>
        </Card>
      )}
    </Popover>
  );
};

export default AccountPopover;
