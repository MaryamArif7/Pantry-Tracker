
"use client"
import React, { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  TextField,
  Snackbar,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {firestore as db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CameraC = ({ refreshItems }) => {
 const router=useRouter();
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);
  const { user } = useAuth();
 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
const apiKey=process.env.apiKey;
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("Camera API is not supported in this browser");
      setCameraSupported(false);
      setSnackbarMessage("Camera is not supported in this browser");
      setSnackbarOpen(true);
    }
  }, []);

  const takePhoto = () => {
    if (camera.current) {
      const photo = camera.current.takePhoto();
      setImage(photo);
      setOpenModal(true);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setImage(null);
  };
  const handleGoback=()=>{
    router.push("/inventory")
  }
  const handleAdd = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a pantry item predictor. Predict the item I am holding in my hand in the image. Return only the name of the item. If it's not a pantry item, return 'false'.",
            },
            {
              role: "user",
              content: {
                type: "image_url",
                image_url: image, 
              },
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`, 
        },
      });
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
 

      const result = (await response.json()).data;
      if (result !== "false") {
        const pantryRef = collection(db, `users/${user.uid}/inventory`);
        const q = query(pantryRef, where("name", "==", result));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          await addDoc(pantryRef, {
            name: result,
            quantity: 1,
          });
          setSnackbarMessage(`${result} added to your inventory`);
          setSnackbarOpen(true);
        } else {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            quantity: querySnapshot.docs[0].data().quantity + 1,
          });
          setSnackbarMessage(`${result} quantity updated in your inventory`);
          setSnackbarOpen(true);
        }
        refreshItems();
      } else {
        setSnackbarMessage("This item can't be added to your inventory");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpenModal(false);
      setLoading(false);
      setImage(null);

    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className="flex flex-col items-center bg-purple-300 min-h-screen ">
      {cameraSupported ? (
        <>
          <Box
            className="border"
            sx={{ width: "320px", height: "200px" }}
          >
            <Camera
              facingMode="environment"
              ref={camera}
              aspectRatio={ 4/3}
              numberOfCamerasCallback={(numberOfCameras) =>
                console.log("Number of cameras detected:", numberOfCameras)
              }
            />
          </Box>
         <div className="flex gap-5">
         <Button
            onClick={takePhoto}
            className="mt-4 bg-black"
          >
            Take Photo
          </Button>
          <Button onClick={handleGoback}
          
            className="mt-4 bg-black"
          >
            Go back
          </Button>
         </div>
        </>
      ) : (
        <p className="text-red-600">
          Camera is not supported on this device or browser. Please try using a
          different device or updating your browser.
        </p>
      )}

      <Dialog
        open={openModal}
        onClose={!loading ? handleCancel : undefined}
        disableBackdropClick={loading}
        disableEscapeKeyDown={loading}
      >
        <DialogTitle>Photo Taken</DialogTitle>
        <DialogContent className="flex flex-col justify-center items-center">
          <DialogContentText>
            Review the photo. Click "Add" to save the item or "Cancel" to
            discard.
          </DialogContentText>
         
          {image && (
            <img
              src={image}
              alt="Taken photo"
              style={{ width: "100%", marginTop: "10px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancel}
            disabled={loading}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CameraC;
