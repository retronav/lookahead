import * as React from "react";
import { LinearProgress } from "@material-ui/core";

//@ts-ignore
export const LoaderContext = React.createContext<{
  loaderState: boolean;
  start: () => void;
  stop: () => void;
}>();

export const useLoader = () => React.useContext(LoaderContext);

export const Loader = () => {
  return (
    <LoaderContext.Consumer>
      {(ctx) => {
        return (
          <LinearProgress
            color="secondary"
            style={{ position: "absolute", width: "100vw" }}
            hidden={!ctx.loaderState}
          />
        );
      }}
    </LoaderContext.Consumer>
  );
};
