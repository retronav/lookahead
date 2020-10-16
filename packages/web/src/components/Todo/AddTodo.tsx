import React from "react";
import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
const useStyles = makeStyles({
  addTodo: {
    height: "64px",
    width: "64px",
    padding: "0rem",
    borderRadius: "100%",
  },
});
interface Props {
  open: () => void;
}
export default ({ open }: Props) => {
  const classes = useStyles();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (buttonRef.current)
      try {
        // nasty material-ui jss hack which stops material-ui
        // making the button's height 100vh
        buttonRef.current.classList.remove("jss4");
        buttonRef.current.style.height = "64px";
        buttonRef.current.style.minHeight = "64px";
        buttonRef.current.style.maxHeight = "64px";
        buttonRef.current.style.borderRadius = "100%";
      } catch (e) {
        console.log(e);
      }
  }, [buttonRef]);
  return (
    <div style={{ textAlign: "center", paddingTop: "2em" }}>
      <Button
        ref={buttonRef}
        onClick={open}
        className={classes.addTodo}
        variant="outlined"
        color="secondary"
      >
        <Add fontSize="large" />
      </Button>
    </div>
  );
};
