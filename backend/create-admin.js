const mongoose = require('mongoose');
const User = require('./models/User');

console.log('Attempting to connect to MongoDB...');

mongoose.connect('mongodb://localhost:27017/carservice')
    .then(async () => {
        console.log('MongoDB connected successfully');
        
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }
        
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
            isAdmin: true
        });
        
        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('You can now access the admin panel at http://localhost:3000/admin');
        
        process.exit(0);
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });