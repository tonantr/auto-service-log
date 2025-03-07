import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import usePagination from "../../../usePagination";

function MyServices() {
    const [services, setServices] = useState([]);
    const [carID, setCarID] = useState("");
    const [cars, setCars] = useState([])
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const {
        page,
        perPage,
        setTotalPagesCount,
        paginationControls,
    } = usePagination();

    const handleAddService = () => {
        navigate("/user/add-service")
    };

    const handleUpdateService = (service_id) => {
        navigate(`/user/update-service/${service_id}`)
    };

    const handleDeleteService = (service_id) => {
        navigate(`/user/delete/service/${service_id}`)
    }

    const options = cars.map(car => ({
        value: car.car_id,
        label: `${car.car_id} - ${car.name}`
    }));


    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchCars = async () => {
            try {
                const response = await axios.get('/user/cars/ids-and-names', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCars(response.data)
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
        fetchCars()
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchServices = async () => {
            try {
                const response = await axios.get('/user/services', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, per_page: perPage, car_id: carID },
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
    }, [page, perPage, carID, navigate]);

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
            <h3>My Services</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Select Car</label>
                </div>

                <div style={{ width: "200px" }}>
                    <Select
                        options={options}
                        value={options.find(option => option.value === carID) || null}
                        onChange={selectedOption => setCarID(selectedOption?.value || "")}
                        isDisabled={options.length === 0}
                    />
                </div>

            </div>

            <div style={{ marginTop: "30px" }}>
                <button className="button button-primary" onClick={handleAddService}>Add</button>
            </div>

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

export default MyServices;
