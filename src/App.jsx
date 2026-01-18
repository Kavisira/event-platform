import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Submissions from "./pages/Submission";
import Register from "./pages/Register";
import ChangePassword from "./pages/ChangePassword";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ToastContainer";

const DashboardWrapper = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return isAdmin ? <AdminDashboard /> : <Dashboard />;
};

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardWrapper />
              </ProtectedRoute>
            }
          />
          <Route
    path="/create"
    element={
      <ProtectedRoute>
        <CreateEvent />
      </ProtectedRoute>
    }
  />
  <Route
    path="/event/:id/submissions"
    element={
      <ProtectedRoute>
        <Submissions />
      </ProtectedRoute>
    }
  />

  <Route
    path="/event/:id/edit"
  element={
    <ProtectedRoute>
      <EditEvent />
    </ProtectedRoute>
  }
/>

        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
