
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-gray-900">Addis Kitchen</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-orange-600 transition-colors ${
                isActive("/") ? "text-orange-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/menu"
              className={`text-gray-700 hover:text-orange-600 transition-colors ${
                isActive("/menu") ? "text-orange-600 font-semibold" : ""
              }`}
            >
              Menu
            </Link>
            <Link
              to="/order"
              className={`text-gray-700 hover:text-orange-600 transition-colors ${
                isActive("/order") ? "text-orange-600 font-semibold" : ""
              }`}
            >
              Order Online
            </Link>
            <Link
              to="/book"
              className={`text-gray-700 hover:text-orange-600 transition-colors ${
                isActive("/book") ? "text-orange-600 font-semibold" : ""
              }`}
            >
              Reservations
            </Link>
            <Link
              to="/contact"
              className={`text-gray-700 hover:text-orange-600 transition-colors ${
                isActive("/contact") ? "text-orange-600 font-semibold" : ""
              }`}
            >
              Contact
            </Link>
            <Link to="/admin">
              <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
