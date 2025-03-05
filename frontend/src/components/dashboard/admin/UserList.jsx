import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import usePagination from "../../../usePagination";

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const {
        page,
        perPage,
        setTotalPagesCount,
        paginationControls,
    } = usePagination();

    const handleAddUser = () => {
        navigate("/admin/add-user")
    };

    const handleUpdateUser = (user_id) => {
        navigate(`/admin/update-user/${user_id}`);
    };

    const handleDeleteUser = (user_id) => {
        navigate(`/admin/delete/user/${user_id}`);
    }

    useEffect(() => {
        const token = localStorage.getItem('access_token'); 

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page, per_page: perPage },
                });
                setUsers(response.data.users);
                setTotalPagesCount(response.data.total_pages);
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    console.error("Error fetching users:", error);
                    setError(error.response?.data?.message || "Failed to load users.");
                }
            }
        };

        fetchUsers();
    }, [page, perPage, navigate]);


    return (
        <div>
            <h3>User List</h3>
            <button className="button button-primary"  onClick={handleAddUser}>Add</button>
            {error && <p>{error}</p>}

            <table style={{ marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="button button-primary"  onClick={() => handleUpdateUser(user.user_id)}>Update</button>
                                <button className="button button-primary"  onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {paginationControls}
        </div>
    );
}

export default UserList;