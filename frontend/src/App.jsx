import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';

// --- Components ---
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import UserDashboard from "./components/dashboard/user/UserDashboard";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// --- Admin Components ---
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
import SearchResults from "./components/dashboard/admin/SearchResults";

// --- User Components ---
import DashboardHomeUser from "./components/dashboard/user/DashboardHomeUser";
import MyProfile from "./components/dashboard/user/MyProfile";
import UpdateProfile from "./components/dashboard/user/UpdateProfile";
import MyCars from "./components/dashboard/user/MyCars";
import UserAddCar from "./components/dashboard/user/UserAddCar";
import UserUpdateCar from "./components/dashboard/user/UserUpdateCar";
import MyServices from "./components/dashboard/user/MyServices";
import UserAddService from "./components/dashboard/user/UserAddService";
import UserUpdateService from "./components/dashboard/user/UserUpdateService";
import SearchPage from "./components/dashboard/user/SearchPage";
import UserDeletePage from "./components/dashboard/user/UserDeletePage";

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
          <Route path="profile" element={<MyProfile />} />
          <Route path="update-profile" element={<UpdateProfile />} />
          <Route path="cars" element={<MyCars />} />
          <Route path="add-car" element={<UserAddCar />} />
          <Route path="update-car/:car_id" element={<UserUpdateCar />} />
          <Route path="services" element={<MyServices />} />
          <Route path="add-service" element={<UserAddService />} />
          <Route path="update-service/:service_id" element={<UserUpdateService />} />
          <Route path="search-page" element={<SearchPage />} />
          <Route path="delete/:entity/:id" element={<UserDeletePage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
