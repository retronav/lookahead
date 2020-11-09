import Authenticated from "../components/Firebase/Authenticated";
import dynamic from "next/dynamic";
import * as React from "react";
import LazyLoader from "../components/Application/LazyLoader";
import { useRouter } from "next/router";
import isBrowser from "../components/util/isBrowser";
const Application = dynamic(
  () => import("../components/Application/Application"),
  { ssr: false, loading: () => <LazyLoader /> }
);
const App = () => {
  const router = useRouter();
  return (
    <>
      <Authenticated
        loading={<LazyLoader />}
        noAuth={
          <>
            {isBrowser() && window.localStorage.getItem("isSignedIn") !== "true"
              ? (window.location.pathname = "/signin")
              : ""}
          </>
        }
      >
        <Application />
      </Authenticated>
    </>
  );
};
export default App;
