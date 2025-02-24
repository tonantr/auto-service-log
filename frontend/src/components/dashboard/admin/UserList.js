import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

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
            })
            .catch((err) => {
                setError("Error fetching users: " + err.message);
            });
    }, [navigate]);

    return (
        <div>
            <h3 className="text-2xl font-semibold">List Users</h3>

            {error && <p className="text-red-500">{error}</p>}

            {users.length === 0 ? (
                <p className="text-gray-600 mt-2">No users found.</p>
            ) : (
                <ul className="mt-4">
                    {users.map((user) => (
                        <li key={user.user_id} className="bg-white p-2 mb-2 shadow rounded">
                            {user.username} - {user.role}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default UserList;