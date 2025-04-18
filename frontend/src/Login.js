import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from './SharedComponents/TextInput';
import './styles/index.css'; 
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import {loginUser} from './services/apiService'; 

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const { token } = await loginUser(username, password);  //Login user and get token

            localStorage.setItem('token', token); //Store token in localStorage for session persistence
            setToken(token);
            setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
            setTimeout(() => {
              navigate('/home');
          }, 1500);
        } catch (error) {
            console.error('Login failed', error);
            setSnackbar({ open: true, message: error.response.data.error, severity: 'error' });
        }
    };

    return (
        <div className="form-container">
            <div className="form-card">
                <h2 className="text-center">Login</h2>
                <TextInput
                    id="log_username"
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required={true}
                />
                <TextInput
                    id="log_password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required={true}
                />
                <button id='login_btn' className="form-button" onClick={handleLogin}>Login</button>

                <div className="text-center">
                    <p className="mb-0">
                      Don't have an account? <a href="/register" className="text-decoration-none">Sign up</a>
                    </p>
                </div>
            </div>
            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>
    );
};

export default Login;
