import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, Menu as MenuIcon, X as CloseIcon } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = (
    <>
      <Link
        to="/"
        className={`block md:inline text-gray-700 hover:text-orange-600 transition-colors ${
          isActive("/") ? "text-orange-600 font-semibold" : ""
        }`}
        onClick={() => setMobileOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/menu"
        className={`block md:inline text-gray-700 hover:text-orange-600 transition-colors ${
          isActive("/menu") ? "text-orange-600 font-semibold" : ""
        }`}
        onClick={() => setMobileOpen(false)}
      >
        Menu
      </Link>
      <Link
        to="/order"
        className={`block md:inline text-gray-700 hover:text-orange-600 transition-colors ${
          isActive("/order") ? "text-orange-600 font-semibold" : ""
        }`}
        onClick={() => setMobileOpen(false)}
      >
        Order Online
      </Link>
      <Link
        to="/book"
        className={`block md:inline text-gray-700 hover:text-orange-600 transition-colors ${
          isActive("/book") ? "text-orange-600 font-semibold" : ""
        }`}
        onClick={() => setMobileOpen(false)}
      >
        Reservations
      </Link>
      <Link
        to="/contact"
        className={`block md:inline text-gray-700 hover:text-orange-600 transition-colors ${
          isActive("/contact") ? "text-orange-600 font-semibold" : ""
        }`}
        onClick={() => setMobileOpen(false)}
      >
        Contact
      </Link>
      <Link to="/admin" onClick={() => setMobileOpen(false)}>
        <Button
          variant="outline"
          className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white w-full md:w-auto mt-2 md:mt-0"
        >
          Admin Login
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">Addis Kitchen</span>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">{navLinks}</div>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center text-orange-600 focus:outline-none"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Open menu"
          >
            {mobileOpen ? <CloseIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
     {mobileOpen && (
  <div className="fixed inset-0 z-50 flex">
    {/* Overlay */}
    <div
      className="flex-1 bg-black bg-opacity-30"
      onClick={() => setMobileOpen(false)}
      aria-label="Close menu overlay"
    />
    {/* Slide-in menu */}
    <div className="w-3/4 max-w-xs bg-white shadow-lg border-r border-orange-100 animate-slide-in-left h-full flex flex-col items-center py-8">
      <button
        className="self-end mr-4 mb-6 text-orange-600 focus:outline-none"
        onClick={() => setMobileOpen(false)}
        aria-label="Close menu"
      >
        <CloseIcon className="h-8 w-8" />
      </button>
       <Link to="/" className="flex items-center space-x-2 mb-8">
            <Utensils className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">Addis Kitchen</span>
          </Link>
           
      <div className="flex flex-col items-center space-y-6 w-full">{navLinks}</div>
    </div>
    <style>
      {`
        .animate-slide-in-left {
          animation: slideInLeft 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes slideInLeft {
          from { transform: translateX(100%); opacity: 0;}
          to { transform: translateX(0); opacity: 1;}
        }
      `}
    </style>
  </div>
)}
      <style>
        {`
          .animate-fade-in-down {
            animation: fadeInDown 0.3s ease;
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;