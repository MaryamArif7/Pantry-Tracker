"use client";
import "./globals.css";
import { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation";
import { auth } from "./firebase"; // 
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Use useState

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user); // Update state based on user
    });

    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (isUserLoggedIn) {
      router.push("/pantry"); 
    } else {
      router.push("/signup"); 
    }
  };

  return (
    <>
      <div className="flex items-center ">
        <div className="text-3xl text-green-400">🥫</div>
        <span className="text-white text-2xl font-bold">PantryCheck</span>
      </div>
      <div className="flex">
        <div className="mt-16">
          <h1 className="text-8xl">Welcome</h1>
          <h1 className="text-4xl">
            Smart Inventory Management system at <br /> your fingertips
          </h1>
          <div className="mt-10 ">
            <button
              onClick={handleGetStarted}
              className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition duration-200"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 mt-10">
        <div className="bg-customPurple hover:bg-onHover flex justify-center items-center w-52 h-32 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
          Cook with confidence
        </div>
        <div className="hover:bg-onHover bg-customPurple flex justify-center items-center w-52 h-32 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
          Easy to use
        </div>
        <div className="bg-customPurple hover:bg-onHover flex justify-center items-center w-52 h-32 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
          User Friendly
        </div>
        <div className="bg-customPurple hover:bg-onHover flex justify-center items-center w-52 h-32 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
          Manage Your Pantries
        </div>
      </div>
    </>
  );
}
