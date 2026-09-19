import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContextType";
import Modal from "./Modal";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { showToast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    showToast("success", "Logged out successfully. See you soon!");
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            TravelApp
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/my-bookings"
                      className="text-sm font-medium text-gray-600 hover:text-blue-600"
                    >
                      My Bookings
                    </Link>
                    <Link
                      to="/profile"
                      className="text-sm font-medium text-gray-600 hover:text-blue-600"
                    >
                      Profile
                    </Link>
                  </>
                )}
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Are You Logging Out?"
        description="You can always log back in at any time. See you soon!."
        confirmText="Log out"
        cancelText="Cancel"
        // image=""
      />
    </>
  );
};

export default Navbar;
