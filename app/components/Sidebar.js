"use client";
import { useState, useEffect } from "react";
import { HomeIcon, UserIcon, CogIcon, ArrowLeftOnRectangleIcon, MoonIcon, SunIcon, ChartPieIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const { logout } = useAuth();

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Toggle Theme (Dark/Light Mode)
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Load Theme from LocalStorage on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="h-6 w-6" />, path: "/" },
    { name: "Dashboard", icon: <ChartPieIcon className="h-6 w-6" />, path: "/dashboard" },
    { name: "Agreement", icon: <DocumentTextIcon className="h-6 w-6" />, path: "/agreements" },
    { name: "Profile", icon: <UserIcon className="h-6 w-6" />, path: "/profile" },
    { name: "Settings", icon: <CogIcon className="h-6 w-6" />, path: "/settings" },
  ];

  return (
    <div className={`flex flex-col ${isOpen ? "w-64" : "w-20"} bg-gray-800 p-5 transition-width duration-300`}>
      {/* Toggle Button */}
      <button onClick={toggleSidebar} className="text-white mb-6 focus:outline-none">
        {isOpen ? "←" : "→"}
      </button>

      {/* Menu Items */}
      <ul className="space-y-4 flex-grow">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link href={item.path} className="flex items-center text-white hover:bg-gray-700 p-2 rounded">
              <div className="flex-shrink-0">{item.icon}</div>
              <span className={`ml-4 ${!isOpen && "hidden"}`}>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Dark/Light Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="text-white flex items-center hover:bg-gray-700 p-2 rounded mt-6"
      >
        {theme === "light" ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
        <span className={`ml-4 ${!isOpen && "hidden"}`}>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
      </button>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="text-white flex items-center hover:bg-red-600 p-2 rounded mt-6"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
        <span className={`ml-4 ${!isOpen && "hidden"}`}>Logout</span>
      </button>
    </div>
  );
}
