// firebase.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; 
export const updateItem = async (id, updatedData) => {
  const itemRef = doc(db, "inventory", id); // Replace "items" with your collection
  await updateDoc(itemRef, updatedData);
};

