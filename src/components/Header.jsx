import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QventLogo from "../assets/Qvent.png";

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

export default function Header() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [user] = useState(() => {
    // Get user data from localStorage
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    const userMobile = localStorage.getItem("userMobile");
    
    console.log('Header loading user data:', { userName, userEmail, userMobile });
    
    return {
      name: userName || "User",
      email: userEmail || "user@email.com",
      mobile: userMobile || "N/A"
    };
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("userName");
      localStorage.removeItem("userMobile");
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  };

  const userLetter = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <header className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
        >
          <img src={QventLogo} alt="Qvent Logo" className="w-9 h-9 object-contain" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Qvent</h1>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            {/* Profile Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {userLetter}
            </div>
            {/* User Name */}
            <span className="text-sm font-semibold text-gray-700 hidden md:inline">{user?.name}</span>
            {/* Chevron */}
            <ChevronIcon />
          </button>

          {/* Dropdown Menu */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              {/* Profile Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {userLetter}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user?.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Logout Option */}
              <button
                onClick={() => {
                  setShowProfile(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm font-medium"
              >
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
