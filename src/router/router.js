import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../util/ProtectedRoute";
import Tasks from "../pages/Tasks";
import Events from "../pages/Events";
import SchedulingResultsPage from "../pages/SchedulingResultsPage";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login"; // Use the correct import

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Tasks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/events",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Events />
      </ProtectedRoute>
    ),
  },
  {
    path: "/schedule/:eventId",
    element: (
      <ProtectedRoute>
        <Navbar />
        <SchedulingResultsPage />
      </ProtectedRoute>
    ),
  },
]);
