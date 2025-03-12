import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePagination from "../../../usePagination";
import { BASE_URL } from "../../../config";

function LogsLogin() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const {
        page,
        perPage,
        setTotalPagesCount,
        paginationControls,
    } = usePagination();

    const handleDeleteLog = (log_id) => {
        navigate(`/admin/delete/log/${log_id}`)
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchLogs = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/admin/logs_login`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, per_page: perPage },
                });

                setLogs(response.data.logs);
                setTotalPagesCount(response.data.total_pages);

            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    console.error("Error fetching logs:", error);
                    setError(error.response?.data?.message || "Failed to load logs.");
                }
            }
        };

        fetchLogs();
    }, [page, perPage, navigate]);

    return (
        <div>
            <h3>Logs Login</h3>
            {error && <p>{error}</p>}

            <table style={{ marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Login Time</th>
                        <th>Logout Time</th>
                        <th>IP Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>No logs available</td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <tr key={log.log_id}>
                                <td>{log.log_id}</td>
                                <td>{log.user_id}</td>
                                <td>{log.login_time || "N/A"}</td>
                                <td>{log.logout_time || "N/A"}</td>
                                <td>{log.ip_address}</td>
                                <td>
                                    <button className="button button-primary" onClick={() => handleDeleteLog(log.log_id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {paginationControls}

        </div>
    );
}

export default LogsLogin;