"use client";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link"; // Using Link for navigation
import { usePathname } from "next/navigation"; // For detecting current route

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get current path using Next.js hook

  const menuItems = [
    { label: "Home", key: "/", link: "/" },
    { label: "Club Players", key: "/allPlayers", link: "/allPlayers" },
    // { label: "Points Table", key: "/points-table", link: "/points-table" },
    { label: "Teams", key: "/teams", link: "/allTeams" },
    { label: "Matches", key: "/matches", link: "/matches" },
    { label: "Buy Products", key: "products", link: "https://sandhutsportsclub.com/products" },
    // You can add a submenu if needed, for now it's commented out
    // { label: "More", key: "/more", link: "/more", subMenu: [...] }
  ];

  // Toggle for mobile menu
  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <div className="relative">
          <img
            src="/SSC logo.png" // Replace with your logo path
            alt="Logo"
            className="w-32 md:w-40 h-auto mt-16"
          />
        </div>

        {/* Hamburger Icon (visible on smaller devices) */}
        <div className="md:hidden flex ml-auto"> {/* Use flex and ml-auto to push the hamburger to the right */}
          <button
            onClick={toggleMenu}
            className="text-gray-800 hover:text-gray-600 focus:outline-none"
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Navbar Items */}
        <div
          className={`md:flex items-center space-x-4 px-1 ${isOpen ? "block" : "hidden"} md:block`} // Reduced gap between items
        >
          {menuItems.map((item) => (
            <div key={item.key} className="relative">
              <Link
                href={item.link}
                className={`${
                  pathname === item.link || (pathname === "/" && item.link === "/home")
                    ? "border-b-4 border-blue-600 text-blue-600 font-semibold font-prosto"
                    : "text-gray-600 hover:bg-gray-200 hover:text-blue-600 font-prosto"
                } block px-4 py-2 transition-all duration-300`}
              >
                {item.label}
                {/* Show down arrow if it's the "More" menu */}
                {item.label === "More" && (
                  <ChevronDownIcon className="w-5 h-5 inline-block ml-2" />
                )}
              </Link>

              {/* Submenu for "More" (if applicable) */}
              {item.subMenu && (
                <div className="ml-4 space-y-2 mt-2 absolute bg-white shadow-lg w-48 z-50">
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.key}
                      href={subItem.link}
                      className={`${
                        pathname === subItem.link
                          ? "border-b-4 border-blue-600 text-blue-600 font-semibold font-prosto"
                          : "text-gray-800 hover:bg-gray-200 hover:text-blue-600 font-prosto"
                      } block px-4 py-2 transition-all duration-300`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-100 fixed top-0 right-0 w-3/4 h-full shadow-lg z-50 p-4 overflow-y-auto">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-800 hover:text-gray-600 absolute top-4 "
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="flex flex-col space-y-4 mt-10">
            {menuItems.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.link}
                  className={`${
                    pathname === item.link || (pathname === "/" && item.link === "/home")
                      ? "border-b-4 border-blue-600 text-blue-600 font-semibold font-prosto"
                      : "text-gray-800 hover:bg-gray-200 hover:text-blue-600 font-prosto"
                  } px-4 py-2`}
                >
                  {item.label}
                </Link>
                {/* Show the submenu for "More" item */}
                {item.subMenu && (
                  <div className="ml-4 space-y-2 mt-2">
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.key}
                        href={subItem.link}
                        className={`${
                          pathname === subItem.link
                            ? "border-b-4 border-blue-600 text-blue-600 font-semibold font-prosto"
                            : "text-gray-800 hover:bg-gray-200 hover:text-blue-600 font-prosto"
                        } block px-4 py-2`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
