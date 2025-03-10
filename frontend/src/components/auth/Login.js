import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';

function Login( {setIsAuthenticated, setRole}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const login = async function (e) {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/`, 
                { username, password }, 
                {
                    headers: {
                        "Content-Type": "application/json",  
                    },
                });

            if (response.status === 200 && response.data.access_token && response.data.role && response.data.username) {
                setError(null);
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('username', response.data.username);

                setIsAuthenticated(true);
                setRole(response.data.role);

                if (response.data.role === 'admin') {
                    navigate('/admin');
                } else if (response.data.role === 'user') {
                    navigate('/user');
                } else {
                    setError('Invalid role');
                    navigate('/');
                }

            } 
        }
        catch (err) {
            setError('Invalid credentials');
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '10px', marginLeft: '10px'}} className="login-container">
            <h3>Login</h3>
            <form onSubmit={login}>
                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label htmlFor="username">Username</label>
                    </div>
                    <input
                        id="username"
                        type="text"
                        value={username || ''}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-button"
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <div>
                        <label htmlFor="password">Password</label>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password || ''}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-button"
                    />
                </div>
                <button type="submit" style={{ marginTop: '10px' }} className="button button-primary">Login</button>
            </form>

            <p>Need an account? Please contact the administrator.</p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

        </div>
    );
};

export default Login;