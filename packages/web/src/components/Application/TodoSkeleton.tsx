import * as React from "react";
import { Skeleton } from "@material-ui/lab";
import { createStyles, makeStyles, useTheme } from "@material-ui/styles";
import { Box, Theme, Typography, useMediaQuery } from "@material-ui/core";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
export default () => {
  const classes = useStyles();
  const theme: Theme = useTheme();
  const matchesXSSM = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const matchesSMMD = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const skeleton = (key: number) => (
    <Box className={classes.card} key={key}>
      <Skeleton
        style={{ borderRadius: 10 }}
        animation="wave"
        variant="rect"
        width="100%"
        height="100%"
      >
        <Typography variant="h4">
          <Skeleton variant="text" animation="wave"></Skeleton>
        </Typography>
        <Skeleton variant="text" animation="wave"></Skeleton>
      </Skeleton>
    </Box>
  );
  return (
    <>
      {matchesXSSM
        ? skeleton(1)
        : matchesSMMD
        ? [1, 2].map((n) => skeleton(n))
        : [1, 2, 3, 4].map((n) => skeleton(n))}
    </>
  );
};
