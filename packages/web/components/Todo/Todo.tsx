import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  ButtonBase,
  createStyles,
  Fade,
} from "@material-ui/core";
import React from "react";
interface Props {
  title: string;
  content?: string;
  id: string;
  handles: {
    open: (key: string) => void;
    close: () => void;
  };
}
const useStyles = makeStyles((theme) =>
  createStyles({
    cardContent: {
      position: "relative",
      width: "100%",
      height: "100%",
      padding: "0.5em",
      textAlign: "left",
    },
    card: {
      width: "24vw",
      margin: "1vh 0.5vw",
      height: "25vh",
    },
    [theme.breakpoints.between("sm", "md")]: {
      card: {
        width: "48vw",
      },
    },
    [theme.breakpoints.between("xs", "sm")]: {
      card: {
        width: "97vw",
      },
    },
  })
);

const Todo = ({ title, content, handles, id }: Props) => {
  const classes = useStyles();
  const updateTodo = () => {
    handles.open(id);
  };
  return (
    <Grid item>
      <Fade in={true}>
        <Card className={classes.card}>
          <ButtonBase onClick={updateTodo} className={classes.cardContent}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h5">{title}</Typography>
              <Typography noWrap={true} variant="body1" component="p">
                {content}
              </Typography>
            </CardContent>
          </ButtonBase>
        </Card>
      </Fade>
    </Grid>
  );
};

export default Todo;
