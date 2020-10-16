import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
} from "@material-ui/core";
import React from "react";
import { authServices } from "../Firebase/services";
interface Props {
  dialogState: boolean;
  handleClose: () => void;
  firestore: firebase.firestore.Firestore | null;
}
export default ({ dialogState, firestore, handleClose }: Props) => {
  const { useAuth } = authServices();
  const currentUser = useAuth();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const handleSave = () => {
    handleClose();
    firestore
      ?.collection(`users/${currentUser ? currentUser.uid : ""}/todos`)
      .add({ content: content, title: title })
      .catch((e) => {
        throw e;
      });
  };
  return (
    <Dialog fullWidth={true} open={dialogState}>
      <DialogTitle>Add a new to-do</DialogTitle>
      <DialogContent>
        <FormControl color="secondary" fullWidth>
          <InputLabel>Add a title</InputLabel>
          <Input
            value={title}
            onChange={(evt) => setTitle(evt.currentTarget.value)}
          />
        </FormControl>
        <br />
        <br />
        <FormControl color="secondary" fullWidth>
          <InputLabel>Add content (optional)</InputLabel>
          <Input
            multiline
            value={content}
            onChange={(evt) => setContent(evt.currentTarget.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={title === ""}
          variant="outlined"
          color="secondary"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
