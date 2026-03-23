import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import ShowTasks from "./pages/ShowTasks";
import SearchTasks from "./pages/SearchTasks";
import Progress from "./pages/Progress";
import CalendarView from "./pages/CalendarView";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { ThemeProvider } from "./context/ThemeContext";

function App() {

  const location = useLocation();

  // Navbar hide on auth pages
 const hideNavbar = ["/login", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <ThemeProvider>

      {/* ✅ Navbar only after login */}
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* 🔓 PUBLIC */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔒 PROTECTED */}
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        } />

        <Route path="/create" element={
          <ProtectedRoute><CreateTask /></ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute><ShowTasks /></ProtectedRoute>
        } />

        <Route path="/search" element={
          <ProtectedRoute><SearchTasks /></ProtectedRoute>
        } />

        <Route path="/progress" element={
          <ProtectedRoute><Progress /></ProtectedRoute>
        } />

        <Route path="/calendar" element={
          <ProtectedRoute><CalendarView /></ProtectedRoute>
        } />

      </Routes>
    </ThemeProvider>
  );
}

export default App;