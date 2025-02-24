import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get('/admin/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setError("Error fetching users: " + err.message);
            });
    }, [navigate]);

    return (
        <div>

            {error && <p className="text-red-500">{error}</p>}

            {loading ? (
                <p className="text-gray-600 mt-2">Loading...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-600 mt-2">No users found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(function (user) {
                            return (
                                <tr key={user.user_id}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>{user.email}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserList;