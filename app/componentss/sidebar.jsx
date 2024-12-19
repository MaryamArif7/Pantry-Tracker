
"use client"
import React from "react";


import { Archive,Notebook, LogOut} from "lucide-react";
import Link from "next/link";

import { usePathname } from "next/navigation";

const SidebarLink = ({ href, icon: Icon, label, onClick }) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  return (
    <Link href={href}>
      <div
        onClick={onClick}
        className={`cursor-pointer flex items-center px-8 py-4 hover:text-purple-400 hover:bg-purple-400 gap-3 transition-colors ${
          isActive ? "bg-purple-400 text-white" : ""
        }`}
      >
        <Icon className="w-6 h-6 !text-gray-700" />
        <span className="font-medium text-black">
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = () => {


  return (
  <div className="">
      <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-t from-violet-600 to-white shadow-md">
  
  <div className="flex gap-3 justify-between items-center pt-8 px-8">
  
    <h1 className="font-extrabold text-2xl">StockCheck</h1>
  </div>

  <div className="flex-grow mt-8">

    <SidebarLink href="/inventory" icon={Archive} label="Inventory" />
    <SidebarLink href="/recipes" icon={Notebook} label="Recipes" />
    <SidebarLink href="#" icon={LogOut} label="Logout" onClick={() => signOut()} />
  
  </div>


 
</div>
<div>Welcome</div>
  </div>
  );
};

export default Sidebar;

