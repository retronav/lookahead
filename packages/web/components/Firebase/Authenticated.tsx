import React from "react";
interface Props {
  loading?: JSX.Element;
  noAuth: JSX.Element;
  children: JSX.Element;
}
import { authServices, useIsSignedIn } from "./services";
const Authenticated = (props: Props) => {
  const { useAuth } = authServices();
  const user = useAuth();
  const { isSignedIn } = useIsSignedIn();
  if (!user && isSignedIn === "true")
    return props.loading || <div>Loading</div>;
  else if (!user) return props.noAuth;
  else if (user) return props.children;
  else return props.noAuth;
};

export default Authenticated;
