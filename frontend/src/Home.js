import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


const Home = ({ handleLogout }) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  useEffect(() => {
    if (!token) {
      navigate('/login'); 
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; 

    if (decodedToken.exp < currentTime) {
      handleLogout();
      navigate('/login');
      return;
    }

    axios.get('http://localhost:3000/home', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => setMessage(response.data.message))
      .catch(() => {
        handleLogout();
        navigate('/login');
      });
  }, [token, navigate, handleLogout]);

  return (
    <div>
      <h1>Home Page</h1>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
