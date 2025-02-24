import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaginatedTable from "../../../PaginatedTable";

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

    const columns = [
        { name: "Username", selector: row => row.username },
        { name: "Role", selector: row => row.role },
        { name: "Email", selector: row => row.email },
    ];

    return (
        <div>
            {error && <p className="text-red-500">{error}</p>}
            {loading ? (
                <p className="text-gray-600 mt-2">Loading...</p>
            ) : (
                <PaginatedTable title="User List" columns={columns} data={users} />
            )}
        </div>
    );
}

export default UserList;