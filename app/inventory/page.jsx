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
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Page = () => {
  const router=useRouter();
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [count, setCount] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");
  const [showComponent, setShowComponent] = useState(false);
  const [open, setOpen] = useState(false);
  const exportData = () => {
    console.log("Inventory Data:", inventory);
    if (!inventory || inventory.length === 0) {
      alert("No data available to export");
      return;
    }
    const dataToExport = inventory.map((item) => ({
      Item: item.name,
      Quantity: item.count,
    }));
    console.log("Data to Export:", dataToExport);
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Your List");
    XLSX.writeFile(workbook, "pantry_data.xlsx");
  };
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
  const totalPages = Math.ceil(inventory.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
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
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleCameraClick = () => {
 router.push('/camera')
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
            <button
              onClick={handleCameraClick}
              className="bg-purple-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-purple-700"
            >
              <CameraIcon className="w-5 h-5" />
          
              <span>Add Items Using Camera</span>
            </button>
          </div>

          <div className="bg-neutral-100 w-80 h-20 mt-6 px-4 py-3 flex items-center justify-center">
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-purple-700"
              onClick={exportData}
            >
              <ArrowDownIcon className="w-5 h-5" />
              <span>Export Items List</span>
            </button>
          </div>
        </div>

        <div className="mt-20 p-4 w-2/3">
          <Table className="w-full bg-white shadow-md rounded-lg border-violet-900">
            <TableCaption className="text-lg font-semibold mb-4 text-center">
              List of Items
            </TableCaption>
            <TableHeader className="bg-neutral-200 text-gray-900">
              <TableRow>
                <TableHead className="py-4 text-center">Item</TableHead>
                <TableHead className="py-4 text-center">Quantity</TableHead>
                <TableHead className="py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="py-3 text-center">
                    {item.name}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    {item.count}
                  </TableCell>
                  <TableCell className="py-3 text-center">
                    <Button
                      onClick={() => removeItem(item.name)}
                      className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded mr-2"
                    >
                      Remove
                    </Button>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          onClick={() => editItem(item.name, item.count)}
                          className="bg-purple-500 hover:bg-purple-700 text-white px-2 py-1 rounded"
                        >
                          Edit
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit Item</SheetTitle>
                          <SheetDescription>
                            Update the item's quantity.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="itemName">Item</Label>
                            <Input
                              id="itemName"
                              value={editingItem || ""}
                              onChange={(e) => setEditingItem(e.target.value)}
                              className="col-span-3"
                              disabled
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="count">Quantity</Label>
                            <Input
                              id="count"
                              type="number"
                              value={editingQuantity || ""}
                              onChange={(e) =>
                                setEditingQuantity(e.target.value)
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <SheetFooter>
                          <SheetClose asChild>
                            <Button
                              onClick={updateItem}
                              className="bg-purple-500 hover:bg-purple-700"
                            >
                              Save changes
                            </Button>
                          </SheetClose>
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem
                key={i + 1}
                isActive={i + 1 === currentPage}
                onClick={() => handlePageChange(i + 1)}
              >
                <PaginationLink>{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
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
