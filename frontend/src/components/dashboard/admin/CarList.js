import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaginatedTable from "../../../PaginatedTable";

function CarList() {
    const [cars, setCars] = useState([]);
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
            .get('/admin/cars', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setCars(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError("Error fetching users: " + err.message);
            });
    }, [navigate]);

    const columns = [
        { name: "ID", selector: row => row.car_id },
        { name: "Owner", selector: row => row.owner },
        { name: "Name", selector: row => row.name },
        { name: "Model", selector: row => row.model },
        { name: "Year", selector: row => row.year },
        { name: "VIN", selector: row => row.vin },
    ];

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-gray-600 mt-2">Loading...</p>
            ) : (
                <PaginatedTable title="Car List" columns={columns} data={cars} />
            )}
        </div>
    );
}

export default CarList;