import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePagination from "../../../usePagination";

function ServiceList() {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const {
        page,
        perPage,
        totalPages,
        handleNextPage,
        handlePreviousPage,
        setTotalPagesCount,
    } = usePagination();

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
                setLoading(true);
            } catch (error) {
                setError('Failed to load services.');
                setLoading(false);
            }
        };

        fetchServices();
    }, [page, perPage, navigate, setTotalPagesCount]);

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
            <button>Add</button>
            {loading && <p>Loading services...</p>}
            {error && <p>{error}</p>}

            <table>
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
                                <button>Update</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                <button onClick={handlePreviousPage} disabled={page === 1}>
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button onClick={handleNextPage} disabled={page === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}

export default ServiceList;
