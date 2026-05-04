const axios = require('axios');

async function testRegister() {
  try {
    const response = await axios.post('https://blood-donation-portal-ct4z.onrender.com/api/auth/register', {
      name: 'Test User',
      email: `test_${Date.now()}@example.com`,
      phoneNo: '1234567890',
      password: 'password123',
      role: 'donor'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
  }
}

testRegister();
