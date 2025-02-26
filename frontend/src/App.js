import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserList from "./components/dashboard/admin/UserList";
import CarList from "./components/dashboard/admin/CarList";
import ServiceList from "./components/dashboard/admin/ServiceList";
import DashboardHome from "./components/dashboard/admin/DashboardHome";
import SearchResults from "./components/dashboard/admin/SearchResults";
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UserList />} />
          <Route path="cars" element={<CarList />} />
          <Route path="services" element={<ServiceList />} />
          <Route path="search-results" element={<SearchResults />} />
        </Route>
        {/* <Route
          path="/search-results"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SearchResults />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
