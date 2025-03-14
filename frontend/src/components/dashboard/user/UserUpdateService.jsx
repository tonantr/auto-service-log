import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { validateMileageCost } from "../../../validation";
import { serviceTypes } from "../../../Constants";
import { BASE_URL } from "../../../config";

function UserUpdateService() {
    const { service_id } = useParams();
    const [data, setData] = useState({
        mileage: '',
        type: '',
        date: '',
        nextDate: '',
        cost: '',
        notes: '',
    });

    const [originalData, setOriginalData] = useState({});

    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchService = async () => {
            try {
                const token = localStorage.getItem('access_token');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${BASE_URL}/user/service/${service_id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.status === 200) {
                    const { mileage, service_type, service_date, next_service_date, cost, notes } = response.data;
                    setData({
                        mileage: response.data.mileage,
                        type: response.data.service_type,
                        date: response.data.service_date,
                        nextDate: response.data.next_service_date,
                        cost: response.data.cost,
                        notes: response.data.notes,
                    });
                    setOriginalData({ mileage, service_type, service_date, next_service_date, cost, notes })
                }
            } catch (err) {
                setError('Failed to fetch service data.');
            }
        };
        fetchService()
    }, [service_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

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
            const response = await axios.put(`${BASE_URL}/user/update_service/${service_id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                navigate("/user/services");
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                navigate("/login");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                console.error('Error:', err);
                setError("Failed to update a service.");
            }
        }
    };

    const isDataChanged =
        data.mileage !== originalData.mileage ||
        data.type !== originalData.service_type ||
        data.date !== originalData.service_date ||
        data.nextDate !== originalData.next_service_date ||
        data.cost !== originalData.cost ||
        data.notes !== originalData.notes;

    return (
        <div>
            <h3>Update Service</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>

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
                    <button type="submit" className="button button-primary" disabled={!isDataChanged}>Update</button>
                    <button type="button" className="button button-secondary" onClick={() => navigate("/user/services")}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default UserUpdateService