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
      setIsUserLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (isUserLoggedIn) {
      router.push("/inventory"); 
    } else {
      router.push("/signup"); 
    }
  };

  return (
    <>
    <div className="  bg-purple-300  w-full min-h-screen">
      <div className="ml-20  mr-28">
      <nav className="bg-purple-900 bg-opacity-35  p-4 shadow-lg rounded-3xl  mx-4">
        <div className=" container mx-auto flex justify-between items-center">
          <div className="text-black text-2xl font-bold">Stock Check</div>
          <ul className="flex space-x-6">
            <li>
              <a
                href="#home"
                className="text-gray-100 hover:text-violet-300 px-3 py-2 rounded-md transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-gray-100 hover:text-violet-300 px-3 py-2 rounded-md transition duration-300"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-gray-100 hover:text-violet-300 px-3 py-2 rounded-md transition duration-300"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="flex justify-between items-center mt-10">
          <div className="gap-3">
            <h1 className="text-4xl font-extrabold mb-3">Your pantry, perfectly organized.</h1>
            <h1 className="text-4xl font-extrabold mb-3">
              Never miss an item again <span className="text-purple-700"><br /> With Stock Check</span>
            </h1>
            <p className="font-bold mb-3">
              You'll never lose track of what's in your pantry. Avoid buying duplicates <br /> 
              and make the most of your groceries by always knowing what you have on hand.
            </p>
            <div className="mt-10">
              <button
                onClick={handleGetStarted}
                className="bg-purple-500 text-white py-3 px-6 rounded-lg hover:bg-purple-600 transition duration-200"
              >
                Try Stock Check For Free
              </button>
            </div>
          </div>
          <div>
            <img src="./assets/6.png" alt="App usage demonstration" className="w-96 h-auto rounded-lg shadow-lg" />
          </div>
        </div>


      </div>
  
    </div>
     
    </>
  );
}
