import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DeletePage() {
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
            const response = await axios.delete(`/admin/delete_${entity}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });


            if (response.status === 400) {
                setError(response.data.message);
                return;
            }
            if (response.status === 404) {
                setError("User not found.");
                return;
            }
            if (response.status === 200) {
                navigate(`/admin/${entity}s`); 
            }
            
        } catch (err) {
            console.error('Delete error:', err);
            setError("Failed to delete.");
        } 
    };

    useEffect(() => {
        if (!id) {
            setError('Invalid ID.');
            return;
        }
    }, [id]);

    useEffect(() => {
        if (isConfirmed) {
            deleteEntity();
        }
    }, [isConfirmed, entity, id]);


    return (
        <div>
            <h3>Deleting {entity}...</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
    
            {!isConfirmed ? (
                <div>
                    <p>Are you sure you want to delete this {entity}?</p>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button className="button button-primary" onClick={() => setIsConfirmed(true)}>Delete</button>
                        <button className="button button-secondary" onClick={() => navigate(`/admin/${entity}s`)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <div>
                    
                </div>
            )}
        </div>
    );
}

export default DeletePage;