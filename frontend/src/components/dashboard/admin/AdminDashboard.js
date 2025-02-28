import React, { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminDashboard({ onLogout }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [loggedInUser, setLoggedInUser] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const username = localStorage.getItem('username');
        const userRole = localStorage.getItem('role');

        if (!token) {
            navigate("/login");
            return;
        }

        setLoggedInUser(username);
        setRole(userRole);
    }, [navigate]);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/admin/search-results?query=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    }, [searchQuery]);

    return (
        <div className="admin-dashboard">
            <div className="sidebar">
                <h3>Menu</h3>
                <ul>
                    <li><Link to="/admin" className="sidebar-link">Dashboard</Link></li>
                    <li><Link to="/admin/users" className="sidebar-link">Users</Link></li>
                    <li><Link to="/admin/cars" className="sidebar-link">Cars</Link></li>
                    <li><Link to="/admin/services" className="sidebar-link">Services</Link></li>
                    <li>
                        <button onClick={onLogout} className="logout-button">
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            <div className="main-content">
                <div className="header">
                    <h2>Admin Dashboard</h2>
                    <p><strong>Signed in as:</strong> {loggedInUser} ({role})</p>
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-bar"
                        />
                        <button type="submit" className="search-button" disabled={!searchQuery.trim()}>
                            Search
                        </button>
                    </form>
                </div>
                <div className="content">
                    <Outlet />
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;