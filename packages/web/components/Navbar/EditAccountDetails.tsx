import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import ReactCrop from "react-image-crop";
import { auth } from "../Firebase/services";
import "react-image-crop/dist/ReactCrop.css";
import firebase from "firebase/app";
import { LoaderContext } from "./Loader";
interface Props {
  open: boolean;
  onClose: () => void;
}
// Copied from https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o?file=/src/App.js:386-1264
function getResizedCanvas(
  canvas: HTMLCanvasElement,
  newWidth: number,
  newHeight: number
) {
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = newWidth;
  tmpCanvas.height = newHeight;

  const ctx = tmpCanvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    newWidth,
    newHeight
  );

  return tmpCanvas;
}

function generateDownload(
  cb: (b: Blob | null) => void,
  previewCanvas: HTMLCanvasElement,
  crop: ReactCrop.Crop
) {
  if (!crop || !previewCanvas) {
    return;
  }
  const canvas = getResizedCanvas(
    previewCanvas,
    crop.width || 0,
    crop.height || 0
  );

  canvas.toBlob(cb, "image/png", 1);
}

const EditAccountDetails = ({ open, onClose }: Props) => {
  const [displayName, setDisplayName] = React.useState<string | null>(
    auth.currentUser ? auth.currentUser.displayName : null
  );
  const [img, setImg] = React.useState<{
    file: File | null;
    photoURL: string | null;
  }>({
    file: null,
    photoURL: null,
  });
  const [crop, setCrop] = React.useState<ReactCrop.Crop>({
    width: 100,
    aspect: 1,
    unit: "px",
  });
  const [
    completedCrop,
    setCompletedCrop,
  ] = React.useState<ReactCrop.Crop | null>(null);
  const previewCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const inputFileRef = React.useRef<HTMLInputElement>(null);
  const onLoad = React.useCallback((img) => {
    //@ts-ignore
    imgRef.current = img;
  }, []);
  const loader = React.useContext(LoaderContext);
  React.useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }
    const pixelRatio = 4;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.width = (crop.width as number) * pixelRatio;
    canvas.height = (crop.height as number) * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      image,
      (crop.x as number) * scaleX,
      (crop.y as number) * scaleY,
      (crop.width as number) * scaleX,
      (crop.height as number) * scaleY,
      0,
      0,
      crop.width as number,
      crop.height as number
    );
  }, [completedCrop]);

  const startLoader = () => React.useEffect(() => loader.start());
  const stopLoader = () => React.useEffect(() => loader.stop());

  const onImageUpload = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target && evt.target.files) {
      const file = evt.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const result = fileReader.result as string;
        setImg({ file, photoURL: result });
      };
      if (file) {
        fileReader.readAsDataURL(file);
      }
    }
  };
  const handleSave = React.useCallback(() => {
    if (displayName === "") return;
    const imageDownloadCallback = (img: Blob | null) => {
      loader.start();
      import("firebase/storage")
        .then(async () => {
          const storage = firebase.storage();
          if (img) {
            const storageRef = storage.ref();
            const ref = storageRef.child(
              `users/${auth.currentUser?.uid}/profile.png`
            );
            await ref.put(img);
            const photoURL = await ref.getDownloadURL();
            await auth.currentUser?.updateProfile({
              displayName,
              photoURL: photoURL || auth.currentUser.photoURL,
            });
            if (auth) auth.currentUser?.reload();
          }
          loader.stop();
        })
        .catch((e) => {
          throw e;
        });
    };
    if (completedCrop) {
      generateDownload(
        imageDownloadCallback,
        previewCanvasRef.current as HTMLCanvasElement,
        completedCrop as ReactCrop.Crop
      );
    } else {
      loader.start();
      auth.currentUser
        ?.updateProfile({
          displayName,
        })
        .then(() => {
          if (auth) auth.currentUser?.reload();
          loader.stop();
        });
    }
  }, [completedCrop, loader]);
  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle>Edit Account Details</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          color="secondary"
          value={displayName}
          onChange={(evt) => setDisplayName(evt.currentTarget.value)}
          label="Change your display name"
          error={displayName === ""}
          helperText={displayName === "" ? "Display name cannot be blank" : ""}
        ></TextField>
        {auth.currentUser?.photoURL ? (
          <Avatar
            style={{ height: 64, width: 64 }}
            src={auth.currentUser.photoURL}
          ></Avatar>
        ) : (
          <></>
        )}
        <Typography variant="body1">
          Add or change your profile image
        </Typography>
        {img.file && (
          <>
            {/*
          //@ts-ignore */}
            <ReactCrop
              src={img.photoURL || ""}
              crop={crop}
              onImageLoaded={onLoad}
              onChange={(newCrop: ReactCrop.Crop) => setCrop(newCrop)}
              onComplete={(c: ReactCrop.Crop) => setCompletedCrop(c)}
            />
            <div>
              <canvas
                ref={previewCanvasRef}
                style={{
                  display: "none",
                  width: completedCrop?.width ?? 0,
                  height: completedCrop?.height ?? 0,
                }}
              />
            </div>
          </>
        )}
        <Button
          onClick={() => inputFileRef.current?.click()}
          variant="outlined"
          color="secondary"
        >
          Upload
        </Button>
        <input
          style={{ display: "none" }}
          ref={inputFileRef}
          onChange={onImageUpload}
          accept="image/*"
          color="secondary"
          type="file"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="secondary"
          onClick={async () => {
            await handleSave();
            onClose();
          }}
        >
          Save
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAccountDetails;
