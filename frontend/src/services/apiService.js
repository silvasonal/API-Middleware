import axios from 'axios';

export const loginUser = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const registerUser = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const fetchApiKeys = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/auth/apiKeys', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch API keys:', error);
        throw error; 
    }
};

export const fetchApiKeybyUserID = async (userId, token) => {
    try {
        const response = await axios.get(`http://localhost:3000/auth/api-keys/${userId}`,{
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch API keys:', error);
        throw error;
    }
};

export const fetchUsers = async (token) => {
    try {
        const response = await axios.get('http://localhost:3000/auth/users', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error; 
    }
};

export const updateUserRole = async (userId, newRole, token) => {
    try {
        const url =
            newRole === 'admin'
                ? `http://localhost:3000/auth/make-admin/${userId}`
                : `http://localhost:3000/auth/make-user/${userId}`;
        await axios.patch(url, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error('Failed to update user role:', error);
        throw error; 
    }
};


export const fetchCountryData = async (country, userApiKey) => {
    try {
        const response = await axios.get(`http://localhost:3000/auth/country/${country}`, {
        headers: {
            'X-API-Key': userApiKey,
        },
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch country data:', error);
        throw error; 
    }
};

export const generateApiKey = async (token) => {
    try {
        const response = await axios.post(
        'http://localhost:3000/auth/generate-api-key',
        {},
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
        );
        return response.data;
    }
    catch (error) {
        console.error('Failed to generate API key:', error);
        throw error; 
    }
};

export const deleteApiKey = async (id, token) => {
    try {
        await axios.delete(`http://localhost:3000/auth/api-key/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
    } catch (error) {
        console.error('Failed to delete API key:', error);
        throw error; 
    }
};
