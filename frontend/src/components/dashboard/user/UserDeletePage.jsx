import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../config";

function UserDeletePage() {
    const { entity, id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);

    const getToken = () => localStorage.getItem('access_token');


    const deleteEntity = async () => {
        if (!isConfirmed) return;

        try {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.delete(`${BASE_URL}/user/delete_${entity}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate(`/user/${entity}s`);

        } catch (err) {
            if (err.response) {
                setError(err.response.data.message);
            } else {
                setError("Failed to delete.");
            }
        }
    };

    useEffect(() => {
        if (!id || !entity) {
            setError("Invalid request. Entity or ID is missing.");
        }
    }, [id, entity]);

    useEffect(() => {
        if (isConfirmed) {
            deleteEntity();
        }
    }, [isConfirmed]);


    return (
        <div>
            <h3>Deleting {entity}...</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!isConfirmed ? (
                <div>
                    <p>Are you sure you want to delete this {entity}?</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button className="button button-primary" onClick={() => setIsConfirmed(true)}>Delete</button>
                        <button className="button button-secondary" onClick={() => navigate(`/user/${entity}s`)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div>

                </div>
            )}
        </div>
    );
}

export default UserDeletePage;