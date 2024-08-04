"use client"
import React, { useState, useEffect } from "react";
import {
  collection,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebase"; 
import {
  Modal,
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Snackbar,
  IconButton,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { grey, blue, red ,purple} from '@mui/material/colors';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [count, setCount] = useState("");
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");

  const editItem = (name, count) => {
    setEditingItem(name);
    setEditingQuantity(count);
    handleOpen();
  };

  const updateInventory = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(firestore, "inventory", item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        setSnackbarMessage(`${item} removed from inventory.`);
      } else {
        await setDoc(docRef, { count: parseInt(count) });
        setSnackbarMessage(`${item} added to inventory.`);
      }
      await updateInventory();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const updateItem = async (item) => {
    try {
      const docRef = doc(firestore, "inventory", item);
      await setDoc(docRef, { count: parseInt(editingQuantity) });
      setSnackbarMessage(`${item} updated in inventory.`);
      await updateInventory();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      width="80%"
      maxWidth="600px"
      height="80vh"
      display="flex"
      margin="0 auto"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      p={3}
      bgcolor="#4d425f"
      borderRadius={2}
      boxShadow={3}
    >
      <Typography variant="h3" style={{ color: '#fff', fontWeight: 'bold' }}>
        Pantry Stock
      </Typography>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="30%"
          left="50%"
          transform="translate(-50%,-50%)"
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={3}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          justifyContent="center"
        >
          <Typography variant="h6" align="center">
            {editingItem ? "Edit Item" : "Add Item"}
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={editingItem ? editingItem : itemName}
              onChange={(e) => editingItem ? setEditingItem(e.target.value) : setItemName(e.target.value)}
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={editingItem ? editingQuantity : count}
              onChange={(e) => editingItem ? setEditingQuantity(e.target.value) : setCount(e.target.value)}
              required
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                editingItem ? updateItem(editingItem) : addItem(itemName);
                setItemName("");
                setEditingItem(null);
                handleClose();
              }}
            >
              {editingItem ? "Update" : "Add"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box display="flex" spacing={2} gap={2}>
        <Button variant="contained" color="secondary" onClick={handleOpen}>
          Add Item Using Form
        </Button>
        <Button variant="contained" color="secondary">
          Add Item Using Camera
        </Button>
      </Box>

      <Stack width="100%" spacing={2} overflow="auto" mt={2}>
        {inventory.map(({ name, count }) => (
          <Box
            key={name}
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#241b35"
            padding={2}
            borderRadius={1}
            boxShadow={1}
          >
            <Typography variant="h6" color="gray" style={{ flex: 1 }}>
              {name}
            </Typography>
            <Typography variant="h6" color="gray" style={{ flex: 1 }}>
              {count}
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                aria-label="delete"
                color="secondary"
                onClick={() => removeItem(name)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                aria-label="edit"
                color="primary"
                onClick={() => editItem(name, count)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Stack>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
