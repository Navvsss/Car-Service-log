const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const auth = require('./middleware/auth');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend')));

let useMockDatabase = false;

const atlasConnectionString = process.env.MONGODB_URI || 'mongodb+srv://navaneethnabakumar_db_user:HeHvFm923KqKtz9u@carservice.cqbu1yr.mongodb.net/';

mongoose.connect(atlasConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => {
        console.log('Failed to connect to MongoDB Atlas, using mock database:', err.message);
        useMockDatabase = true;
        
        global.mockDatabase = {
            users: [],
            vehicles: [],
            services: []
        };
        
        global.idCounter = 1;
        global.generateId = () => `${global.idCounter++}`;
    });

const users = require('./routes/users');
const vehicles = require('./routes/vehicles');
const services = require('./routes/services');

app.use('/api/users', users);
app.use('/api/vehicles', vehicles);
app.use('/api/services', services);

app.use('/admin', auth, express.static(path.join(__dirname, 'public/admin')));

app.get('/', (req, res) => {
    res.json({ 
        message: 'Car Service Logbook API', 
        database: useMockDatabase ? 'Mock database in use' : 'MongoDB connected'
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    if (useMockDatabase) {
        console.log('Using mock database (no MongoDB required)');
    }
});