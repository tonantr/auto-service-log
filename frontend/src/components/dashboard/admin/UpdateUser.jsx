import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { validatePassword, validateEmail } from "../../../validation"
import { BASE_URL } from "../../../config";

function UpdateUser() {
    const { user_id } = useParams();
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });

    const [originalData, setOriginalData] = useState({});

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const getToken = () => localStorage.getItem('access_token');

    useEffect(() => {
        if (!user_id) {
            setError('Invalid user ID.');
            return;
        }

        const fetchUser = async () => {
            try {
                const token = getToken();
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${BASE_URL}/admin/user/${user_id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.status === 200) {
                    const { username, email, role } = response.data;
                    setData({ username, email, role, password: "" });
                    setOriginalData({ username, email });
                }
            } catch (err) {
                setError('Failed to fetch user data.');
            }
        };
        fetchUser()
    }, [user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (data.password) {
            const passwordError = validatePassword(data.password);
            if (passwordError) {
                setError(passwordError);
                return;
            }
        }

        if (data.email) {
            const emailError = validateEmail(data.email);
            if (emailError) {
                setError(emailError);
                return;
            }
        }

        const token = getToken()

        if (!token) {
            navigate("/login")
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/admin/update_user/${user_id}`, data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setData({
                    username: '',
                    email: '',
                    password: '',
                    role: 'user',
                });
                setError('');
                navigate("/admin/users")
            }
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("access_token");
                navigate("/login");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                console.error('Error:', err);
                setError("Failed to update a user.");
            }
        }
    };

    const isDataChanged = data.username !== originalData.username || data.email !== originalData.email || data.password !== "";

    return (
        <div>
            <h3>Update User</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Username</label>
                    </div>
                    <input
                        type="text"
                        value={data.username}
                        onChange={(e) => setData({ ...data, username: e.target.value })}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Email</label>
                    </div>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Password</label>
                    </div>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Role</label>
                    </div>
                    <select
                        value={data.role}
                        onChange={(e) => setData({ ...data, role: e.target.value })}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="button button-primary" disabled={!isDataChanged}>Update</button>
                    <button type="button" className="button button-secondary" onClick={() => navigate("/admin/users")}>Cancel</button>
                </div>
            </form>

        </div>
    );
}

export default UpdateUser;
