import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { validateMileageCost } from "../../../validation";
import { serviceTypes } from "../../../Constants";
import { BASE_URL } from "../../../config";

function AddService() {
    const [carID, setCarID] = useState("");
    const [cars, setCars] = useState([]);
    const [mileage, setMileage] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [nextDate, setNextDate] = useState("");
    const [cost, setCost] = useState("");
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const fetchCars = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get(`${BASE_URL}/admin/cars/list`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCars(response.data);
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

        const errorMessage = validateMileageCost(mileage, cost)
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        const data = { carID, mileage, type, date, nextDate, cost, notes };

        try {
            const response = await axios.post(`${BASE_URL}/admin/add_service`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setError("");
                setCarID("");
                setMileage("");
                setType("");
                setDate("");
                setNextDate("");
                setCost("");
                setNotes("");
                navigate("/admin/services")
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
                            value={options.find(option => option.value === carID)}
                            onChange={selectedOption => setCarID(selectedOption.value)}
                        />
                    </div>

                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Mileage</label>
                    </div>
                    <input
                        type="number"
                        value={mileage}
                        onChange={(e) => setMileage(e.target.value)}
                        required
                    />
                </div>

                {/* <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Service Type</label>
                    </div>
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    />
                </div> */}

                <div style={{ marginBottom: "10px" }}>
                    <div>
                        <label>Service Type</label>
                    </div>
                    <select
                        name="type"
                        value={type}
                        onChange={(e) => setType( e.target.value )}
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
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
                        value={nextDate}
                        onChange={(e) => setNextDate(e.target.value)}
                        placeholder="YYYY-MM-DD"
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Cost</label>
                    </div>
                    <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Notes</label>
                    </div>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="6"
                        cols="30"
                    />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="button button-primary">Add</button>
                    <button type="button" className="button button-secondary" onClick={() => navigate("/admin/services")}>Cancel</button>
                </div>

            </form>

        </div>
    );
}

export default AddService;
