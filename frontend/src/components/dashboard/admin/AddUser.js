import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddUser() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        const token = localStorage.getItem("access_token");

        if (!token) {
            navigate("/login")
            return;
        }

        const data = { username, email, password, role };

        try {
            const response = await axios.post("/admin/add_user", data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                setUsername("");
                setEmail("");
                setPassword("");
                setRole("user");
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
                setError("Failed to add a user.");
            }
        }
    };

    return (
        <div>
            <h3>Add User</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Username</label>
                    </div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Email</label>
                    </div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Password</label>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label>Role</label>
                    </div>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <button type="submit" className="button button-primary">Add</button>
                    <button type="button" className="button button-secondary" onClick={() => navigate("/admin/users")}>Cancel</button>
                </div>
                
            </form>
    
        </div>
    );
}

export default AddUser;
