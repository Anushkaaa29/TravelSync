import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DestinationDetails from "./pages/DestinationDetails";
import MyBookings from "./pages/MyBookings";
import UserProfile from "./pages/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDestinations from "./pages/admin/ManageDestinations";
import AddEditDestination from "./pages/admin/AddEditDestination";
import ManageBookings from "./pages/admin/ManageBookings";
import NotFound from "./pages/NotFound";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./components/MainLayout";
import PublicRoute from "./components/PublicRoute";
import AdminChatUser from "./pages/admin/AdminChatUser";

function App() {
  return (
    <ToastProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/destinations/:id"
              element={
                <MainLayout>
                  <DestinationDetails />
                </MainLayout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <MyBookings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <UserProfile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password/:resetToken"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/destinations"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <ManageDestinations />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/destinations/new"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AddEditDestination />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/destinations/edit/:id"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AddEditDestination />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <ManageBookings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/chat-users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout>
                    <AdminChatUser />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
