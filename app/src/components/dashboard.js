"use client";
import { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "./firebase";
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";


const dashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [itemName, setItemName] = useState("");
    const [open, setOpen] = useState(false);
  
    const updateInventory = async () => {
      const snapshot = query(collection(firestore, "inventory"));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
    };
  
    const addItem = async (item) => {
      const docRef = doc(firestore, "inventory", item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: 1 });
      }
      await updateInventory();
    };
  
    const removeItem = async (item) => {
      const docRef = doc(firestore, "inventory", item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        const { count } = docSnap.data();
        await setDoc(docRef, { count: count + 1 });
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      await updateInventory();
    };
  
    useEffect(() => {
      updateInventory();
    }, []);
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <Box
    width="100vw"
    height="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    gap={2}
  >
    <Modal open={open} onClose={handleClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%,-50%)"
        width={400}
        bgcolor="white"
        border="2px solid #000"
        boxShadow={24}
        p="4"
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: "translate(-50%,-50%)",
        }}
      >
        <Typography variant="h6">Add Item</Typography>

        <Stack width="100%" direction="row" spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              addItem(itemName);
              setItemName("");
              handleClose();
            }}
          >
            Add{" "}
          </Button>
        </Stack>
      </Box>
    </Modal>

    <Button variant="contained" onClick={handleOpen}>
      Add new Item
    </Button>
    <Box border="1px solid #333">
      <Box
        width="800px"
        height="100px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor="#ADD8E6"
      >
        <Typography variant="h2" color="#333">
          inventory Items
        </Typography>
      </Box>
    </Box>
    <Stack width="800px" height="300px" spacing={2} overflow="auto">
      {inventory.map(({ name, count }) => (
        <Box
          key={name}
          width="100%"
          minHeight="150px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="#f0f0f0"
          padding={5}
        >
          <Typography variant="h3" color="#333" textAlign="center">
            {name}
          </Typography>
          <Typography variant="h3" color="#333" textAlign="center">
            {count}
          </Typography>
          <Button variant="contained"  
          onClick={()=>{
            removeItem(name)
          }}
          
          >Remove Items</Button>
        </Box>
      ))}
    </Stack>
  </Box>
);
    

}

export default dashboard