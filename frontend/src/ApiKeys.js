import React, { useState, useEffect } from 'react';
import { Trash3 } from "react-bootstrap-icons";
import { fetchApiKeys, fetchUsers, deleteApiKey } from './services/apiService';
import './styles/index.css'; 
import SharedSnackbar from './SharedComponents/SharedSnackbar';

const ApiKeys = () => {
    const [apikeys, setApiKeys] = useState([]);
    const [users, setUsers] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchData();
    }, [token]);

    // Fetch API keys and users from the server requests
    const fetchData = async () => {
        try {
            const fetchedApiKeys = await fetchApiKeys(token);
            const fetchedUsers = await fetchUsers(token);
            setApiKeys(fetchedApiKeys);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getUsername = (userId) => {
        const user = users.find((u) => parseInt(u.id) === userId); // Find user by matching userId with the user's table 'id'
        return user && user.username ? user.username : 'Unknown'; // Return the username or 'Unknown' if not found
    };

    // Format date and time to a readable format
    const dataTimeFormat = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
        return formattedDate;
    };

    // Handle delete action for API keys
    const handleDelete = async (id) => {
        try {
            await deleteApiKey(id, token);
            setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' });
            fetchData();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' });
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="api-wrapper">
            <h2 className="api-title">API Keys</h2>
            <table className="api-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>API Key</th>
                        <th>Created At</th>
                        <th>Last Used</th>
                        <th>Usage Count</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {apikeys.length > 0 ? (
                        apikeys.map((key) => (
                            <tr key={key.id}>
                                <td>{getUsername(key.user_id)}</td>
                                <td>{key.api_key}</td>
                                <td>{dataTimeFormat(key.created_at)}</td>
                                <td>{dataTimeFormat(key.last_used)}</td>
                                <td>{key.usage_count}</td>
                                <td>
                                    <button className="btn btn-danger" id={`apikey_delete_${key.id}`} onClick={() => handleDelete(key.id)}>
                                        <Trash3 size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="api-no-data">No API Keys Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>
    );
};

export default ApiKeys;
