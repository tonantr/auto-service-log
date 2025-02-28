import React, { useState, useEffect, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function UserDashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [loggedInUser, setLoggedInUser] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const username = localStorage.getItem('username');
        const userRole = localStorage.getItem('role');

        if (!token || userRole !== "user") {
            navigate("/login");
            return;
        }

        setLoggedInUser(username);
        setRole(userRole);
    }, [navigate]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        navigate("/login");
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchQuery("");
        }
    }, [searchQuery]);


    return (
        <div className="user-dashboard">
            <aside className="sidebar">
                <h3>Menu</h3>
                <ul>
                    <li><Link to="/user" className="sidebar-link">Dashboard</Link></li>
                    <li><Link to="#" className="sidebar-link">Profile</Link></li>
                    <li><Link to="#" className="sidebar-link">My Cars</Link></li>
                    <li><Link to="#" className="sidebar-link">My Services</Link></li>
                    <li>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                <header className="header">
                    <h2>User Dashboard</h2>
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
                </header>
                <section className="content">
                    <Outlet />
                </section>
            </main>
        </div>
    );
}

export default UserDashboard;