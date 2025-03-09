import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateVIN, validateYear } from "../../../validation"
import Select from "react-select";
import { BASE_URL } from "../../../config";

function AddCar() {
    const [userID, setUserID] = useState("");
    const [name, setName] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [vin, setVin] = useState("");
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }
            const response = await axios.get(`${BASE_URL}/admin/users/list`, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users:", err)
            setUsers([]);
        }
    };

    const options = users.map(user => ({
        value: user.user_id,
        label: `${user.user_id} - ${user.username}`
    }));

    useEffect(() => {
        fetchUsers()
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");

        if (!token) {
            navigate("/login")
            return;
        }

        const vinError = validateVIN(vin);
        if (vinError) {
            setError(vinError);
            return;
        }

    
        const yearError = validateYear(year);
        if (yearError) {
            setError(yearError);
            return;
        }

        const data = { userID, name, model, year, vin };

        try {
            const response = await axios.post(`${BASE_URL}/admin/add_car`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUserID("");
                setName("");
                setModel("");
                setYear("");
                setVin("");
                navigate("/admin/cars")
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("access_token"); 
                navigate("/login"); 
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                console.error('Error:', err);
                setError("Failed to add a car.");
            }
        }
    };

    return (
        <div>
            <h3>Add Car</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
                    <div style={{marginBottom: "10px"}}>
                        <label>Select Owner</label>
                    </div>
                    {/* <select value={userID} onChange={(e) => setUserID(e.target.value)} required>
                        <option value="">-------- Select --------</option>
                        {users.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.username}
                            </option>
                        ))}
                    </select> */}

                    <div style={{ width: "200px"}}>
                        <Select
                            options={options}
                            value={options.find(option => option.value === userID)}
                            onChange={selectedOption => setUserID(selectedOption.value)}
                        />
                    </div>

                    

                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Name</label>
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Model</label>
                    </div>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Year</label>
                    </div>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
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
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        placeholder="Enter 17-character"
                        required
                    />
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="button button-primary">Add</button>
                    <button type="button" className="button button-secondary" onClick={() => navigate("/admin/cars")}>Cancel</button>
                </div>
                
            </form>
    
        </div>
    );
}

export default AddCar;
