import React from "react";
import { register } from "./registerSW";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";
import { sandbox } from "./util/sandbox";
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
export default () => {
  const [shouldAskForUpdate, setShouldAskForUpdate] = React.useState(false);
  const [swReg, setSwReg] = React.useState<ServiceWorker | null>(null);
  const onSWUpdate = (reg: ServiceWorkerRegistration) => {
    setSwReg(reg.waiting);
    setShouldAskForUpdate(true);
  };
  const snackbar = useSnackbar();
  if (navigator.userAgent !== "ReactSnap" && !isLocalhost) {
    register({
      onUpdate: onSWUpdate,
    });
  }
  return (
    <>
      {sandbox(
        () =>
          shouldAskForUpdate &&
          snackbar.enqueueSnackbar(
            "A newer version of this app is available.",
            {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              action: (
                <>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                      setShouldAskForUpdate(false);
                      swReg && swReg.postMessage({ type: "SKIP_WAITING" });
                      window.location.reload();
                    }}
                  >
                    Update
                  </Button>
                </>
              ),
            }
          )
      )}
    </>
  );
};
