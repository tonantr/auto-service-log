import React, { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../config";
import axios from "axios";

function AdminDashboard({ setIsAuthenticated, setRole }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [loggedInUser, setLoggedInUser] = useState('');
    const [role, setRoleState] = useState('');
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
        setRoleState(userRole);
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
    }, [searchQuery, navigate]);

    const handleLogout = async () => {
        try {
          const token = localStorage.getItem('access_token');
    
          if (token) {
            const response = await axios.post(`${BASE_URL}/logout`, {}, {
              headers: {
                'Authorization': `Bearer ${token}`,
              }
            });
    
            if (response.status === 200) {
              localStorage.clear();
              setIsAuthenticated(false); 
              setRole(''); 
              navigate("/login")
            }
          }
        } catch (error) {
          console.error('Logout request failed:', error);
        }
      };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h3>Menu</h3>
                <ul>
                    <li><Link to="/admin" className="sidebar-link">Dashboard</Link></li>
                    <li><Link to="/admin/users" className="sidebar-link">Users</Link></li>
                    <li><Link to="/admin/cars" className="sidebar-link">Cars</Link></li>
                    <li><Link to="/admin/services" className="sidebar-link">Services</Link></li>
                    <li><Link to="/admin/logs" className="sidebar-link">Activity Logs</Link></li>
                    <li>
                        <button onClick={handleLogout} className="logout-button">
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
                        <button type="submit" className="button button-primary" disabled={!searchQuery.trim()}>
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