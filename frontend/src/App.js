import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Register from './Register';

const App = () => {
  const [token, setToken] = useState(''); 

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && savedToken !== token) {
      setToken(savedToken); 
    }
  }, [token]); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null); 
  };

  return (
    <Router>
      <Routes>
        {!token ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<Home handleLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
