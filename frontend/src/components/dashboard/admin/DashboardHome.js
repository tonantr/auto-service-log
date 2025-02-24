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
            <h3><strong>Total Users:</strong> {dashboardData.total_users}</h3>
            <h3><strong>Total Cars:</strong> {dashboardData.total_cars}</h3>
            <h3><strong>Total Services:</strong> {dashboardData.total_services}</h3>
        </div>
    );
}

export default DashboardHome;