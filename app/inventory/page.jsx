"use client";
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
import MuiAlert from "@mui/material/Alert";
import Sidebar from "../componentss/sidebar";
import {
  PlusIcon,
  CameraIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Snackbar } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Page = () => {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [count, setCount] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(5);
  const [editingItem, setEditingItem] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");
  const [open, setOpen] = useState(false);
  const editItem = (name, count) => {
    setEditingItem(name);
    setEditingQuantity(count);
  };
  const updateItem = async () => {
    if (!editingItem || !editingQuantity) {
      setSnackbarMessage("Item name and quantity are required.");
      setSnackbarOpen(true);
      return;
    }
    try {
      const docRef = doc(firestore, "inventory", editingItem); 
      await setDoc(docRef, { count: parseInt(editingQuantity) }); 
      setSnackbarMessage(`${editingItem} updated in inventory.`);
      await updateInventory();
      setSnackbarOpen(true);
      handleClose();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };
  const itemsPerPage = 3;
  const totalItems = 15;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = inventory.slice(startIndex, startIndex + itemsPerPage);

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

  const addItem = async () => {
    try {
      if (!itemName || !count) {
        setSnackbarMessage("Item name and quantity are required.");
        setSnackbarOpen(true);
        return;
      }

      const docRef = doc(firestore, "inventory", itemName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        setSnackbarMessage(`${itemName} removed from inventory.`);
      } else {
        await setDoc(docRef, { count: parseInt(count) });
        setSnackbarMessage(`${itemName} added to inventory.`);
      }
      await updateInventory();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item:", error);
      setSnackbarMessage("Error adding item.");
      setSnackbarOpen(true);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(firestore, "inventory", item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        setSnackbarMessage(`${item} removed from inventory.`);
      }
      await updateInventory();
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding item:", error);
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
    <>
      <div>
        <Sidebar />
      </div>
      <div className="ml-80">
        <div className="text-4xl font-bold">Welcome To The Stock Check</div>

        <div className="flex gap-5">
          <div className="bg-neutral-100 w-60 h-20 mt-6 px-4 py-3 flex items-center justify-center">
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-purple-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-purple-700 cursor-pointer">
                  <PlusIcon className="w-5 h-5" />
                  <span>Add New Items</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Items</h4>
                    <p className="text-sm text-muted-foreground">
                      Add New Item with Quantity
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="itemName">Item</Label>
                      <Input
                        id="itemName"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        className="col-span-2 h-8"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="count">Quantity</Label>
                      <Input
                        id="count"
                        type="number"
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                        className="col-span-2 h-8"
                      />
                    </div>
                    <Button
                      onClick={addItem}
                      className="bg-purple-700 hover:bg-purple-900"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-neutral-100 w-80 h-20 mt-6 px-4 py-3 flex items-center justify-center">
            <button className="bg-purple-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-purple-700">
              <CameraIcon className="w-5 h-5" />
              <span>Add Items Using Camera</span>
            </button>
          </div>
          <div className="bg-neutral-100 w-80 h-20 mt-6 px-4 py-3 flex items-center justify-center">
            <button className="bg-purple-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-purple-700">
              <ArrowDownIcon className="w-5 h-5" />
              <span>Export Items List</span>
            </button>
          </div>
        </div>

        <div className="mt-20 p-4 w-2/3">
          <Table className="w-full bg-white shadow-md rounded-lg">
            <TableCaption className="text-lg font-semibold mb-4 text-center">
              List of Items
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-300 text-gray-600">
                <TableHead className="p-3 text-left">Item</TableHead>
                <TableHead className="p-3 text-left">Quantity</TableHead>
                <TableHead className="p-3 text-left">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map(({ name, count }) => (
                <TableRow key={name} className="border-t hover:bg-gray-100">
                  <TableCell className="p-3">{name}</TableCell>
                  <TableCell className="p-3">{count}</TableCell>
                  <TableCell className="p-3">
                    <div className="flex gap-3">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-700">
                            Edit
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Edit Item </SheetTitle>
                            <SheetDescription>
                              Make changes to your item info. Click save when
                              you're done.
                            </SheetDescription>
                          </SheetHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Item
                              </Label>
                              <Input
                                id="name"
                                value={editingItem}
                                onChange={(e) => setEditingItem(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Quantity
                              </Label>
                              <Input
                                id="username"
                                value={editingQuantity}
                                onChange={(e) =>
                                  setEditingQuantity(e.target.value)
                                }
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <SheetFooter>
                            <Button
                              onClick={() => {
                                updateItem(); 
                              }}
                              className="bg-purple-600"
                              type="button"
                            >
                              Save changes
                            </Button>
                            <SheetClose asChild>
                              <Button className="bg-gray-400" type="button">
                                Cancel
                              </Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>

                      <button
                        onClick={() => removeItem(name)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-6 flex justify-center">
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PaginationPrevious>
            <PaginationContent>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </PaginationNext>
          </Pagination>
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Page;
