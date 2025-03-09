import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";

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
            .get(`${BASE_URL}/admin/dashboard_home`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setDashboardData(response.data);
            })
            .catch((error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    console.error("Error fetching totals:", error);
                    setError("Error fetching totals");
                }
            });
    }, [navigate]);


    return (
        <>
            <h3>Overview</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p><strong>Total Users:</strong> {dashboardData.total_users}</p>
            <p><strong>Total Cars:</strong> {dashboardData.total_cars}</p>
            <p><strong>Total Services:</strong> {dashboardData.total_services}</p>
        </>
    );
}

export default DashboardHome;