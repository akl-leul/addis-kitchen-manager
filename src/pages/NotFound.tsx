import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FaUtensils } from "react-icons/fa";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="text-center p-8 rounded-3xl shadow-2xl bg-white animate-fade-in">
        <div className="flex justify-center mb-4">
          <span className="relative inline-block">
            <FaUtensils className="text-7xl text-orange-500 animate-bounce-slow drop-shadow-lg" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-orange-200 rounded-full blur-sm opacity-70 animate-pulse"></span>
          </span>
        </div>
        <h1 className="text-6xl font-extrabold text-orange-600 mb-2 drop-shadow animate-pop">
          404
        </h1>
        <p className="text-2xl text-gray-700 mb-4 font-semibold animate-fade-in-delayed">
          Oops! This table is empty.
        </p>
        <p className="text-md text-gray-500 mb-6 animate-fade-in-delayed2">
          The page you’re looking for isn’t on the menu.<br />
          Maybe you’d like to return to the home page and try a different dish?
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-full shadow-lg hover:scale-105 hover:from-orange-600 hover:to-yellow-500 font-bold transition-all duration-200 animate-fade-in-delayed3"
        >
          🍽️ Back to Home
        </a>
      </div>
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease;
          }
          .animate-fade-in-delayed {
            animation: fadeIn 1.5s 0.3s both;
          }
          .animate-fade-in-delayed2 {
            animation: fadeIn 1.5s 0.6s both;
          }
          .animate-fade-in-delayed3 {
            animation: fadeIn 1.5s 0.9s both;
          }
          .animate-pop {
            animation: popIn 0.7s cubic-bezier(.68,-0.55,.27,1.55);
          }
          .animate-bounce-slow {
            animation: bounce 2s infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
          @keyframes popIn {
            0% { transform: scale(0.7); opacity: 0;}
            80% { transform: scale(1.1);}
            100% { transform: scale(1); opacity: 1;}
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-18px);}
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;