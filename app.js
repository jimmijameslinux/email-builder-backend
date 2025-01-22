const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');
const path = require('path');

require('dotenv').config();


const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoose = require('mongoose');

// Replace the following with your MongoDB connection string
const mongoURI = process.env.MONGODB_URI;

mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


app.use(cors());
app.use(bodyParser.json());
app.use('/api', emailRoutes);

app.listen(5000, () => console.log('Server running on http://localhost:5000'));