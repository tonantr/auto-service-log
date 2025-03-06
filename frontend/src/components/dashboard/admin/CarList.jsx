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
        setTotalPagesCount,
        paginationControls,
    } = usePagination();

    const handleAddCar = () => {
        navigate("/admin/add-car");
    };

    const handleUpdateCar = (car_id) => {
        navigate(`/admin/update-car/${car_id}`);
    };

    const handleDeleteCar = (car_id) => {
        navigate(`/admin/delete/car/${car_id}`);
    };

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
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login"); 
                } else {
                    console.error("Error fetching cars:", error);
                    setError(error.response?.data?.message || "Failed to load cars.");
                }
            }
        };

        fetchCars();
    }, [page, perPage, navigate]);

    return (
        <div>
            <h3>Car List</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <button className="button button-primary" onClick={handleAddCar}>Add</button>

            <table style={{ marginTop: "10px" }}>
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
                    {cars.length === 0 ? (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>No cars available</td>
                        </tr>
                    ) : (
                        cars.map((car) => (
                            <tr key={car.car_id}>
                                <td>{car.car_id}</td>
                                <td>{car.owner}</td>
                                <td>{car.name}</td>
                                <td>{car.model}</td>
                                <td>{car.year}</td>
                                <td>{car.vin}</td>
                                <td>
                                    <button className="button button-primary" onClick={() => handleUpdateCar(car.car_id)}>Update</button>
                                    <button className="button button-primary" onClick={() => handleDeleteCar(car.car_id)}>Delete</button>
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

export default CarList;