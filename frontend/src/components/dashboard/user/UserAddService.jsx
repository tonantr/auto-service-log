import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { validateMileageCost } from "../../../validation";
import { serviceTypes } from "../../../Constants";
import { BASE_URL } from "../../../config";

function UserAddService() {
    const [cars, setCars] = useState([]);
    const [data, setData] = useState({
        car_id: "",
        mileage: "",
        type: "",
        date: "",
        nextDate: "",
        cost: "",
        notes: "",
    })
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const fetchCars = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get(`${BASE_URL}/user/cars/ids-and-names`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCars(response.data)
        } catch (err) {
            console.error("Failed to fetch cars:", err)
            setCars([]);
        }
    };

    const options = cars.map(car => ({
        value: car.car_id,
        label: `${car.car_id} - ${car.name}`
    }));

    useEffect(() => {
        fetchCars()
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");

        if (!token) {
            navigate("/login")
            return;
        }

        const errorMessage = validateMileageCost(data.mileage, data.cost)
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/user/add_service`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setData({
                    car_id: "",
                    mileage: "",
                    type: "",
                    date: "",
                    nextDate: "",
                    cost: "",
                    notes: "",
                })
                navigate("/user/services")
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                navigate("/login");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                console.error('Error:', err);
                setError("Failed to add a service.");
            }
        }
    };

    return (
        <div>
            <h3>Add Service</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: '10px' }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label>Select Car</label>
                    </div>
                    <div style={{ width: "200px" }}>
                        <Select
                            options={options}
                            value={options.find(option => option.value === data.car_id)}
                            onChange={selectedOption => setData({ ...data, car_id: selectedOption.value })}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Mileage</label>
                    </div>
                    <input
                        type="number"
                        value={data.mileage}
                        onChange={(e) => setData({ ...data, mileage: e.target.value })}
                        required
                    />
                </div>


                <div style={{ marginBottom: "10px" }}>
                    <div>
                        <label>Service Type</label>
                    </div>
                    <select
                        name="type"
                        value={data.type}
                        onChange={(e) => setData({ ...data, type: e.target.value })}
                        required
                    >
                        <option value="" disabled></option>
                        {serviceTypes.map((service, index) => (
                            <option key={index} value={service}>{service}</option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Service Date</label>
                    </div>
                    <input
                        type="date"
                        value={data.date}
                        onChange={(e) => setData({ ...data, date: e.target.value })}
                        placeholder="YYYY-MM-DD"
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Next Service Date</label>
                    </div>
                    <input
                        type="date"
                        value={data.nextDate}
                        onChange={(e) => setData({ ...data, nextDate: e.target.value })}
                        placeholder="YYYY-MM-DD"
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Cost</label>
                    </div>
                    <input
                        type="number"
                        value={data.cost}
                        onChange={(e) => setData({ ...data, cost: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Notes</label>
                    </div>
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData({ ...data, notes: e.target.value })}
                        rows="6"
                        cols="30"
                    />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="button button-primary">Add</button>
                    <button type="button" className="button button-secondary" onClick={() => navigate("/user/services")}>Cancel</button>
                </div>

            </form>

        </div>
    );
}

export default UserAddService;
