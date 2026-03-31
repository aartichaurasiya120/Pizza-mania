const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/adminModel');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const adminEmail = 'adminpizzahut@gmail.com';
        const adminPassword = 'Admin@123';

        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = new Admin({
            email: adminEmail,
            password: hashedPassword
        });

        await admin.save();
        console.log('Admin created successfully');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
