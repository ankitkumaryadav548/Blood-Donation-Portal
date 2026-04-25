const mongoose = require('mongoose');
require('dotenv').config();
const Donor = require('./models/Donor');
const User = require('./models/User');

const migrateDonors = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const donors = await Donor.find({});
    console.log(`Migrating ${donors.length} donors...`);
    
    for (const d of donors) {
      let update = { country: 'India' }; // Default to India as requested
      
      if (d.location.toLowerCase().includes('jharkhand')) {
        update.state = 'Jharkhand';
      } else if (d.location.toLowerCase().includes('patna')) {
        update.state = 'Bihar';
        update.city = 'Patna';
      } else if (d.location.toLowerCase().includes('jalandher') || d.location.toLowerCase().includes('jalandhar')) {
        update.state = 'Punjab';
        update.city = 'Jalandhar';
      }
      
      await Donor.findByIdAndUpdate(d._id, update);
      console.log(`Updated donor ${d._id} (${d.location}) -> State: ${update.state}, City: ${update.city}`);
    }
    
    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

migrateDonors();
