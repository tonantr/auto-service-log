import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateVIN, validateYear } from "../../../validation"
import { BASE_URL } from "../../../config";

function UserUpdateCar() {
    const { car_id } = useParams();
    const [data, setData] = useState({
        name: '',
        model: '',
        year: '',
        vin: '',
    });

    const [originalData, setOriginalData] = useState({});

    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchCar = async () => {
            try {
                const token = localStorage.getItem('access_token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${BASE_URL}/user/car/${car_id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.status === 200) {
                    const { name, model, year, vin } = response.data;
                    setData({
                        name: response.data.name,
                        model: response.data.model,
                        year: response.data.year.toString(),
                        vin: response.data.vin,
                    });
                    setOriginalData({ name, model, year, vin });
                }
            } catch (err) {
                setError('Failed to fetch car data.');
            }
        };
        fetchCar()
    }, [car_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login")
            return;
        }

        const vinError = validateVIN(data.vin);
        if (vinError) {
            setError(vinError);
            return;
        }

        const yearError = validateYear(data.year);
        if (yearError) {
            setError(yearError);
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/user/update_car/${car_id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                navigate("/user/cars");
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                navigate("/login");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                console.error('Error:', err);
                setError("Failed to update a car.");
            }
        }
    };

    const isDataChanged =
        data.name !== originalData.name ||
        data.model !== originalData.model ||
        Number(data.year) !== originalData.year ||
        data.vin !== originalData.vin;

    return (
        <div>
            <h3>Update Car</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Name</label>
                    </div>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Model</label>
                    </div>
                    <input
                        type="text"
                        value={data.model}
                        onChange={(e) => setData({ ...data, model: e.target.value })}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Year</label>
                    </div>
                    <input
                        type="number"
                        value={data.year}
                        onChange={(e) => setData({ ...data, year: e.target.value })}
                        placeholder="YYYY"
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>VIN</label>
                    </div>
                    <input
                        type="text"
                        value={data.vin}
                        onChange={(e) => setData({ ...data, vin: e.target.value })}
                        placeholder="Enter 17-character"
                        required
                    />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="button button-primary" disabled={!isDataChanged}>Update</button>
                    <button type="button" className="button button-secondary" onClick={() => navigate("/user/cars")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default UserUpdateCar