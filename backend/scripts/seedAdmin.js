const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood-donation';
    
    console.log('Connecting to MongoDB...');
    console.log(`URI: ${mongoUri.replace(/\/\/.*@/, '//<credentials>@')}`);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });

    console.log('MongoDB connected successfully!');

    const adminEmail = 'admin@bloodbank.com';
    const adminPassword = 'Admin@123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('\n✅ Admin user already exists!');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    const admin = new User({
      name: 'System Admin',
      email: adminEmail,
      password: adminPassword,
      phoneNo: '9999999999',
      role: 'admin',
      isVerified: true,
    });

    await admin.save();

    console.log('\n========================================');
    console.log('  ✅ Admin Account Created Successfully!');
    console.log('========================================');
    console.log(`  📧 Email:    ${adminEmail}`);
    console.log(`  🔑 Password: ${adminPassword}`);
    console.log('========================================');
    console.log('  Use these credentials to login as admin.');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Make sure MongoDB is running locally');
    console.error('  2. Or check your MONGODB_URI in .env');
    console.error('  3. If using Atlas, whitelist your IP at: https://cloud.mongodb.com/\n');
    process.exit(1);
  }
};

createAdmin();
