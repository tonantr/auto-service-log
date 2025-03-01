import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePagination from "../../../usePagination";

function ServiceList() {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const {
        page,
        perPage,
        setTotalPagesCount,
        paginationControls,
    } = usePagination();

    const handleAddService = () => {
        window.confirm("Are you sure?")
    };

    const handleUpdateService = (serviceId) => {
        window.confirm("Are you sure?")
    };

    const handleDeleteService = (serviceId) => {
        window.confirm("Are you sure?")
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
            return;
        }
        const fetchServices = async () => {
            try {
                const response = await axios.get('/admin/services', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, per_page: perPage },
                });
                setServices(response.data.services);
                setTotalPagesCount(response.data.total_pages);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    console.error("Error fetching services:", error);
                    setError(error.response?.data?.message || "Failed to load services.");
                }
            }
        };

        fetchServices();
    }, [page, perPage, navigate]);

    const truncateText = (text) => {
        if (text && text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        return text;
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    return (
        <div>
            <h3>Service List</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={handleAddService}>Add</button>

            <table style={{ marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Car Name</th>
                        <th>Mileage</th>
                        <th>Service Type</th>
                        <th>Service Date</th>
                        <th>Next Service Date</th>
                        <th>Cost</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service.service_id}>
                            <td>{service.service_id}</td>
                            <td>{service.car_name}</td>
                            <td>{service.mileage}</td>
                            <td>{truncateText(service.service_type)}</td>
                            <td>{formatDate(service.service_date)}</td>
                            <td>{formatDate(service.next_service_date)}</td>
                            <td>${service.cost}</td>
                            <td title={service.notes}>
                                {truncateText(service.notes)}
                            </td>
                            <td>
                                <button onClick={handleUpdateService}>Update</button>
                                <button onClick={handleDeleteService}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {paginationControls}
        </div>
    );
}

export default ServiceList;
