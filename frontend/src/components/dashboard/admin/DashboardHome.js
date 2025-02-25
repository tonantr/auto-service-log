import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashboardHome() {
    const [dashboardData, setDashboardData] = useState({
        total_users: 0,
        total_cars: 0,
        total_services: 0,
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
            return
        }

        axios
            .get('/admin/dashboard_home', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setDashboardData(response.data);
            })
            .catch((err) => {
                setError("Error fetching users: " + err.message);
            });
    }, [navigate]);


    return (
        <div>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <h3>Dashboard Totals</h3>
            <p>Total Users: {dashboardData.total_users}</p>
            <p>Total Cars: {dashboardData.total_cars}</p>
            <p>Total Services: {dashboardData.total_services}</p>
        </div>
    );
}

export default DashboardHome;