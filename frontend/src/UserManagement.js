import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUserRole } from './services/apiService'; 
import SharedSnackbar from './SharedComponents/SharedSnackbar';
import './styles/index.css'; 

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [updatedRoles, setUpdatedRoles] = useState({}); 
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        try {
            const fetchedUsers = await fetchUsers(token);
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Function to handle role change
    const handleRoleChange = (userId, newRole) => {
        setUpdatedRoles(prevRoles => ({
            ...prevRoles, // Update the state with the new role
            [userId]: newRole,  
        }));
    };

    const saveChanges = async () => {
        try {
            for (const userId in updatedRoles) {
                const newRole = updatedRoles[userId];
                await updateUserRole(userId, newRole, token); 
            }
            setSnackbar({ open: true, message: 'Changes saved successfully', severity: 'success' });
            fetchData(); 
            setUpdatedRoles({}); 
        } catch (error) {
            console.error('Failed to save changes:', error);
            setSnackbar({ open: true, message: 'Failed to save changes', severity: 'error' });
        }
    };

    return (
        <div className="user-list-section">
            <h3>User List</h3>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>
                                <input
                                    id={`usrmgmnt_admin_checkbox_${user.id}`}
                                    type="checkbox"
                                    checked={updatedRoles[user.id] ? updatedRoles[user.id] === 'admin' : user.role === 'admin'}
                                    onChange={(e) =>
                                        handleRoleChange(user.id, e.target.checked ? 'admin' : 'user')
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="save-changes-section">
                <button className="save-changes-btn" id = "usrmgmnt_save_changes_btn" onClick={saveChanges}>
                    Save Changes
                </button>
            </div>
            <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
        </div>
    );
};

export default UserManagement;
