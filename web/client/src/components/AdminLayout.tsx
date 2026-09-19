import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Map, Calendar, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";
import { useToast } from "../context/ToastContextType";
import { useState } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    showToast("success", "Logged out successfully. See you soon!");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Map, label: "Destinations", path: "/admin/destinations" },
    { icon: Calendar, label: "Bookings", path: "/admin/bookings" },
    { icon: User, label: "Chat User", path: "/admin/chat-users" },
  ];

  return (
    <>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
          <div className="flex h-16 items-center justify-center border-b px-6">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              TravelAdmin
            </Link>
          </div>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
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

export default AdminLayout;
