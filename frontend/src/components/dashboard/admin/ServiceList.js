import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaginatedTable from "../../../PaginatedTable";

function ServiceList() {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get('/admin/services', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setServices(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError("Error fetching users: " + err.message);
            });
    }, [navigate]);

    const truncateText = (text) => {
        if (text && text.length > 30) {
            return text.substring(0, 30) + "...";
        }
        return text;
    };

    const columns = [
        { name: "ID", selector: row => row.service_id },
        { name: "Car Name", selector: row => row.car_name },
        { name: "Mileage", selector: row => row.mileage },
        { 
            name: "Service Type", selector: row => (
                <td title={row.service_type}>
                    {truncateText(row.service_type)}
                </td>
            )

        },
        { name: "Service Date", selector: row => row.service_date },
        { name: "Next Service Date", selector: row => row.next_service_date },
        { name: "Cost", selector: row => row.cost },
        {
            name: "Notes", selector: row => (
                <td title={row.notes}>
                    {truncateText(row.notes)}
                </td>
            )
        },
    ];

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-gray-600 mt-2">Loading...</p>
            ) : (
                <PaginatedTable title="Service List" columns={columns} data={services} />
            )}
        </div>
    );
}

export default ServiceList;