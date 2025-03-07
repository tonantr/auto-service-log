import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyProfile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleUpdateProfile = (user_id) => {
        navigate("/user/update-profile")
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token'); 

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get('/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);
                
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    console.error("Error fetching profile:", error);
                    setError(error.response?.data?.message || "Failed to load profile.");
                }
            }
        };

        fetchProfile();
    }, [navigate]);

    return (
        <div>
            {user ? (
                <>
                    <h3>Profile</h3>
                    <p><strong>User Name:</strong> {user.username}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button className="button button-primary" onClick={() => handleUpdateProfile(user.user_id)}>Update</button>
                </>
            ) : (
                <p>Loading profile...</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default MyProfile;