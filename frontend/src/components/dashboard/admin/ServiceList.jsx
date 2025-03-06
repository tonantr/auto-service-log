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
        navigate("/admin/add-service");
    };

    const handleUpdateService = (service_id) => {
        navigate(`/admin/update-service/${service_id}`)
    };

    const handleDeleteService = (service_id) => {
        navigate(`/admin/delete/service/${service_id}`)
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

            <button className="button button-primary" onClick={handleAddService}>Add</button>

            <table style={{ marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Mileage</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Next Date</th>
                        <th>Cost</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center" }}>No services available</td>
                            </tr>
                        ) : (
                            services.map((service) => (
                                <tr key={service.service_id}>
                                    <td>{service.service_id}</td>
                                    <td>{service.car_name || "N/A"}</td>
                                    <td>{service.mileage || "0"}</td>
                                    <td>{truncateText(service.service_type || "N/A")}</td>
                                    <td>{formatDate(service.service_date) || "N/A"}</td>
                                    <td>{formatDate(service.next_service_date) || "N/A"}</td>
                                    <td>${service.cost || "0.00"}</td>
                                    <td title={service.notes || "N/A"}>{truncateText(service.notes || "N/A")}</td>
                                    <td>
                                        <button className="button button-primary" onClick={() => handleUpdateService(service.service_id)}>Update</button>
                                        <button className="button button-primary" onClick={() => handleDeleteService(service.service_id)}>Delete</button>
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

export default ServiceList;
