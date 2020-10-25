import { Box, Button, ClickAwayListener, TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { authServices } from "../Firebase/services";
import { checkEmptyStr, getDate } from "../util";
import { useLoader } from "../Navbar/Loader";

const BorderlessField = withStyles({
  root: {
    "& .MuiInput-underline:after": {
      display: "none",
    },
    "& .MuiInput-underline:before": {
      display: "none",
    },
  },
})(TextField);
const BorderlessTitleField = withStyles({
  root: {
    "& .MuiInput-root": {
      fontWeight: "bold",
      fontSize: "1.5rem",
    },
  },
})(BorderlessField);

interface Props {
  firestore: firebase.firestore.Firestore | null;
}
const CreateTodo = ({ firestore }: Props) => {
  const { useAuth } = authServices();
  const currentUser = useAuth();
  const clickAwayRef = React.useRef<HTMLSpanElement>(null);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const loader = useLoader();
  const boxRef = React.useRef<HTMLDivElement>(null);
  const handleClose = () => {
    setTitle("");
    setContent("");
    setFocused(false);
    clickAwayRef.current?.focus();
  };
  const handleSave = () => {
    // Don't let users save blank notes
    if (!title) return;
    loader.start();
    handleClose();
    firestore
      ?.collection(`users/${currentUser ? currentUser.uid : ""}/todos`)
      .add({
        content: content.trim(),
        title: title.trim(),
        last_edited: JSON.stringify(getDate()),
      })
      .then(() => loader.stop())
      .catch((e) => {
        throw e;
      });
  };
  const onEnterKey = (evt: React.KeyboardEvent) => {
    if (evt.key === "Enter") handleSave();
  };
  // remove jss3
  React.useEffect(() => {
    if (boxRef && boxRef.current)
      try {
        // nasty material-ui jss hack which stops material-ui
        boxRef.current.querySelector(".MuiBox-root")?.classList.remove("jss3");
      } catch (e) {
        console.log(e);
      }
  }, [boxRef]);
  return (
    <>
      <ClickAwayListener onClickAway={() => setFocused(false)}>
        <div ref={boxRef} style={{ textAlign: "center", paddingTop: "2em" }}>
          <Box
            onFocus={() => setFocused(true)}
            width="80vw"
            boxShadow={3}
            mx="10%"
            px={2}
            py={1}
          >
            <BorderlessTitleField
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}
              onKeyPress={onEnterKey}
              fullWidth
              placeholder="What's in your mind?"
            />
            <BorderlessField
              value={content}
              onChange={(evt) => setContent(evt.target.value)}
              style={{ display: focused ? "inherit" : "none" }}
              multiline
              fullWidth
              placeholder="Add some more info here"
            />
            <div style={{ display: focused ? "inherit" : "none" }}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleSave}
                disabled={checkEmptyStr(title)}
              >
                Save
              </Button>
              <Button
                onClick={handleClose}
                color="secondary"
                variant="outlined"
              >
                Cancel
              </Button>
            </div>
          </Box>
        </div>
      </ClickAwayListener>
      <span ref={clickAwayRef} className="click-away"></span>
    </>
  );
};

export default CreateTodo;
