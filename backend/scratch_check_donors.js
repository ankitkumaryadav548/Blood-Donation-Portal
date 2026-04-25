const mongoose = require('mongoose');
require('dotenv').config();
const Donor = require('./models/Donor');
const User = require('./models/User');

const checkDonors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const donors = await Donor.find({}).populate('userId', 'name');
    console.log(`Found ${donors.length} donors:`);
    donors.forEach(d => {
      console.log(`- Name: ${d.userId?.name || 'Unknown'}, Location: ${d.location}, Country: ${d.country}, State: ${d.state}, City: ${d.city}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDonors();
