import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Theme,
} from "@material-ui/core";
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import * as React from "react";
import { checkEmptyStr, ISOToReadableDate } from "../util";
import { authServices } from "../Firebase/services";
import { TodoData } from "../Application/Application";
interface Props {
  dialogState: { open: boolean; key: string; data: TodoData };
  handleClose: () => void;
  firestore: firebase.firestore.Firestore | null;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorHelperText: {
      color: theme.palette.error.main,
    },
  })
);
const RedButton = withStyles(
  (theme: Theme) => {
    return {
      root: {
        color: theme.palette.error.main + " !important",
        border: `1px solid ${theme.palette.error.main}` + " !important",
      },
    };
  },
  { withTheme: true }
)(Button);
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

const EditTodo = ({ dialogState, handleClose, firestore }: Props) => {
  const { useAuth } = authServices();
  const todaysDate = new Date().toISOString();
  const currentUser = useAuth();
  const [title, setTitle] = React.useState(dialogState.data.title);
  const [content, setContent] = React.useState(dialogState.data.content);
  const [lastEdited, setLastEdited] = React.useState<string>(
    dialogState.data.last_edited
  );
  const snackbar = useSnackbar();
  const classes = useStyles();
  const handleSave = () => {
    handleClose();
    // Additional check to prevent useless document updataes
    if (
      title !== dialogState.data.title ||
      content !== dialogState.data.content
    )
      firestore
        ?.doc(
          `users/${currentUser ? currentUser.uid : ""}/todos/${dialogState.key}`
        )
        .update({
          content: content,
          title: title,
          last_edited: todaysDate,
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
          <RedButton
            onClick={() => {
              handleDelete();
              snackbar.closeSnackbar("delete-todo");
            }}
            variant="outlined"
          >
            Delete Todo
          </RedButton>
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
        <small>ID : {dialogState.data.id}</small>
        <br />
        {lastEdited && <small>Edited {ISOToReadableDate(lastEdited)}</small>}
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
        <RedButton onClick={askForDelete} variant="outlined">
          Delete Todo
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditTodo;
