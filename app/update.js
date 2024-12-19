// firebase.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; 
export const updateItem = async (id, updatedData) => {
  const itemRef = doc(db, "inventory", id); 
  await updateDoc(itemRef, updatedData);
};

