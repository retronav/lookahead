import Authenticated from "../components/Firebase/Authenticated";
import * as React from "react";
import LazyLoader from "../components/Application/LazyLoader";
import dynamic from "next/dynamic";
import LandingPage from "../components/Application/LandingPage";
const Application = dynamic(
  () => import("../components/Application/Application"),
  { ssr: false, loading: () => <LazyLoader /> }
);

export default function index() {
  return (
    <>
      <Authenticated noAuth={<LandingPage />}>
        <Application />
      </Authenticated>
    </>
  );
}
