const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:3001' })); 

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Authentication routes
app.use('/auth', authRoutes);

// Define the /home route in your server.js or relevant routes file
app.get('/home', (req, res) => {
  res.json({ message: 'Welcome to the home route!' });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});