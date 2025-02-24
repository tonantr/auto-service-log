import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        navigate("/login");
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h3>Admin Menu</h3>
                <ul>
                    <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/admin/users">Users</Link></li>
                    <li><a href="#">Settings</a></li>
                    <li><a href="#" onClick={handleLogout}>Logout</a></li>
                </ul>
            </div>

            <div className="main-content">
                <div className="content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;