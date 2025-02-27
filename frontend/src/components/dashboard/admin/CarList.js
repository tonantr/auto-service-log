import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePagination from "../../../usePagination";

function CarList() {
    const [cars, setCars] = useState([]);
    const [error, setError] = useState('');

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
        const fetchCars = async () => {
            try {
                const response = await axios.get('/admin/cars', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, per_page: perPage },
                });
                setCars(response.data.cars);
                setTotalPagesCount(response.data.total_pages);
            } catch (error) {
                setError('Failed to load cars.');
            }
        };

        fetchCars();
    }, [page, perPage, navigate]);

    return (
        <div>
            <h3>Car List</h3>
            <button>Add</button>
            {error && <p>{error}</p>}

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Owner</th>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>VIN</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car.car_id}>
                            <td>{car.car_id}</td>
                            <td>{car.owner}</td>
                            <td>{car.name}</td>
                            <td>{car.model}</td>
                            <td>{car.year}</td>
                            <td>{car.vin}</td>
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

export default CarList;