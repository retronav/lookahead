import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  Theme,
} from "@material-ui/core";
import { createStyles, makeStyles, withStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import * as React from "react";
import { checkEmptyStr, getDate, LastEdited } from "../../util";
import { authServices } from "../Firebase/services";
interface Props {
  dialogState: { open: boolean; key: string };
  handleClose: () => void;
  firestore: firebase.firestore.Firestore | null;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteBtn: {
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main,
    },
    errorHelperText: {
      color: theme.palette.error.main,
    },
  })
);
const BorderlessTitleField = withStyles({
  root: {
    "& .MuiInput-underline:after": {
      display: "none",
    },
    "& .MuiInput-underline:before": {
      display: "none",
    },
    "& .MuiInput-root": {
      fontWeight: "bold",
      fontSize: "1.5rem",
    },
  },
})(TextField);
const BorderlessContentField = withStyles({
  root: {
    "& .MuiInput-underline:after": {
      display: "none",
    },
    "& .MuiInput-underline:before": {
      display: "none",
    },
  },
})(TextField);
export default ({ dialogState, handleClose, firestore }: Props) => {
  const { useAuth } = authServices();
  const todaysDate = getDate();
  const currentUser = useAuth();
  const [fetchedData, setFetchedData] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [lastEdited, setLastEdited] = React.useState<LastEdited>({
    date: "",
    time: "",
  });
  const snackbar = useSnackbar();
  if (dialogState.open && !fetchedData)
    firestore
      ?.doc(
        `users/${currentUser ? currentUser.uid : ""}/todos/${dialogState.key}`
      )
      .get()
      .then((doc) => {
        setFetchedData(true);
        const data = doc.data();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setLastEdited(JSON.parse(data.last_edited));
        }
      });
  const classes = useStyles();
  const handleSave = () => {
    handleClose();
    firestore
      ?.doc(
        `users/${currentUser ? currentUser.uid : ""}/todos/${dialogState.key}`
      )
      .update({
        content: content,
        title: title,
        last_edited: JSON.stringify(getDate()),
      });
  };
  const handleDelete = () => {
    handleClose();
    firestore
      ?.doc(
        `users/${currentUser ? currentUser.uid : ""}/todos/${dialogState.key}`
      )
      .delete();
  };
  const askForDelete = () => {
    snackbar.enqueueSnackbar("Delete this note? This cannot be reversed.", {
      key: "delete-todo",
      anchorOrigin: {
        horizontal: "center",
        vertical: "bottom",
      },
      persist: true,
      action: (
        <>
          <Button
            onClick={() => {
              handleDelete();
              snackbar.closeSnackbar("delete-todo");
            }}
            color="secondary"
            className={classes.deleteBtn}
            variant="outlined"
          >
            Delete Todo
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              handleClose();
              snackbar.closeSnackbar("delete-todo");
            }}
          >
            Cancel
          </Button>
        </>
      ),
    });
  };
  return (
    <Dialog fullWidth={true} open={dialogState.open}>
      <DialogTitle>Edit Todo</DialogTitle>
      <DialogContent>
        <BorderlessTitleField
          fullWidth
          value={title}
          onChange={(evt) => setTitle(evt.currentTarget.value)}
          placeholder="Add Title"
        />
        <br />
        <br />
        <BorderlessContentField
          fullWidth
          onChange={(el) => setContent(el.target.value)}
          value={content}
          multiline
          placeholder="Add content"
        />
      </DialogContent>
      <p style={{ textAlign: "right", margin: 0, paddingRight: "1em" }}>
        {lastEdited && (
          <small>
            Edited
            {todaysDate.date !== lastEdited.date
              ? " " + lastEdited.date + " at "
              : " "}
            {lastEdited.time}
          </small>
        )}
      </p>
      <br />
      <DialogActions>
        <Button
          disabled={checkEmptyStr(title)}
          onClick={handleSave}
          color="secondary"
          variant="outlined"
        >
          Save
        </Button>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={askForDelete}
          className={classes.deleteBtn}
          variant="outlined"
        >
          Delete Todo
        </Button>
      </DialogActions>
    </Dialog>
  );
};
