const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const genAI = new GoogleGenerativeAI('AIzaSyB-z7c1JnflmjZIWeTEh25hHwkls5QtsOs');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Hi');
    console.log("Success! Response: ", result.response.text());
  } catch (e) {
    console.error('Error:', e.message);
  }
}
run();
