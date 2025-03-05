import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import UserDashboard from "./components/dashboard/user/UserDashboard";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserList from "./components/dashboard/admin/UserList";
import AddUser from "./components/dashboard/admin/AddUser";
import UpdateUser from "./components/dashboard/admin/UpdateUser";
import CarList from "./components/dashboard/admin/CarList";
import AddCar from "./components/dashboard/admin/AddCar";
import UpdateCar from "./components/dashboard/admin/UpdateCar";
import ServiceList from "./components/dashboard/admin/ServiceList";
import AddService from "./components/dashboard/admin/AddService";
import UpdateService from "./components/dashboard/admin/UpdateService";
import DeletePage from "./components/dashboard/admin/DeletePage";
import DashboardHome from "./components/dashboard/admin/DashboardHome";
import DashboardHomeUser from "./components/dashboard/user/DashboardHomeUser";
import UserProfile from "./components/dashboard/user/UserProfile";
import MyCars from "./components/dashboard/user/MyCars";
import SearchResults from "./components/dashboard/admin/SearchResults";
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true)
      setRole(userRole);
    }
  }, [isAuthenticated, role])

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole('');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="admin">
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UserList />} />
          <Route path="cars" element={<CarList />} />
          <Route path="services" element={<ServiceList />} />
          <Route path="search-results" element={<SearchResults />} />
          <Route path="add-user" element={<AddUser />} />
          <Route path="update-user/:user_id" element={<UpdateUser />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="update-car/:car_id" element={<UpdateCar />} />
          <Route path="add-service" element={<AddService />} />
          <Route path="update-service/:service_id" element={<UpdateService />} />
          <Route path="delete/:entity/:id" element={<DeletePage />} />
        </Route>

        <Route
          path="/user"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role={role} requiredRole="user">
              <UserDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomeUser />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="cars" element={<MyCars />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
