import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { validatePassword, validateEmail } from "../../../validation"

function UpdateUser() {
    const { user_id } = useParams();
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
    });
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

                const response = await axios.get(`/admin/user/${user_id}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.status === 200) {
                    setData({
                        username: response.data.username,
                        email: response.data.email,
                        role: response.data.role,
                    });
                }
            } catch (err) {
                setError('Failed to fetch user data.');
            }
        };
        fetchUser()
    }, [user_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(data.password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        const emailError = validateEmail(data.email);
        if (emailError) {
            setError(emailError);
            return;
        }

        const token = getToken()

        if (!token) {
            navigate("/login")
            return;
        }

        try {
            const response = await axios.put(`/admin/update_user/${user_id}`, data, {
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
                        required
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

                <button style={{ marginTop: '10px' }} type="submit">Update</button>
            </form>

        </div>
    );
}

export default UpdateUser;
