import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        navigate("/login");
    };

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h3>Menu</h3>
                <ul>
                    <li><Link to="/admin" className="sidebar-link">Dashboard</Link></li>
                    <li><Link to="/admin/users" className="sidebar-link">Users</Link></li>
                    <li><Link to="/admin/cars" className="sidebar-link">Cars</Link></li>
                    <li><Link to="#" className="sidebar-link">Services</Link></li>
                    <li><a href="#" className="sidebar-link" onClick={handleLogout}>Logout</a></li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <h2>Admin Dashboard</h2>
                </div>
                <div className="content">
                    <Outlet />
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;