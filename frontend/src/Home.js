import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './index.css'; 
import { columnDefs } from './columnDefs';
import { PersonCircle } from 'react-bootstrap-icons';

const Home = ({ handleLogout }) => {
  const [username, setUsername] = useState(''); 
  const [selectedCountry, setSelectedCountry] = useState(''); 
  const [countryData, setCountryData] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]); 

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

    setUsername(decodedToken.username); 
  }, [token, navigate, handleLogout]);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const codes = response.data.map(country => ({
          code: country.cca2,
          name: country.name.common,
        }));
        setCountryCodes(codes);
      })
      .catch(error => {
        console.error('Error fetching country codes:', error);
      });
  }, []); 

  useEffect(() => {
    if (selectedCountry) {
      fetchCountryData(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchCountryData = (country) => {
    axios
      .get(`http://localhost:3000/auth/country/${country}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCountryData(response.data);
      })
      .catch(() => {
        handleLogout();
        navigate('/login');
      });
  };

  console.log('countryData:', countryData);

  return (
    <div>

    <div className="header-container">
    <PersonCircle size={24} style={{ marginRight: '10px' }} />
      <p className="mb-0 mr-3">{username}</p>
      <button id="logout_btn" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>


    <label htmlFor="countries">Select a Country:</label>
    <Select
      className="select-box"
      id="countries"
      value={countryCodes.find(option => option.value === selectedCountry)}
      onChange={(selectedOption) => setSelectedCountry(selectedOption.value)}   
      options={countryCodes.map(country => ({
        value: country.code,
        label: country.name,
      }))}
      placeholder="-- Select a country --"
    />
      
    <div className="ag-theme-alpine" style={{ height: 200,}}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={[countryData]}
        modules={[ClientSideRowModelModule]}
        domLayout='autoHeight'
      />
    </div>

  </div>
  
  );
};

export default Home;
