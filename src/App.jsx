import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import Submissions from "./pages/Submission";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
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
  );
}
