const { GoogleGenerativeAI } = require('@google/generative-ai');

async function run() {
  const genAI = new GoogleGenerativeAI('AIzaSyAfbvJ6lJ7iMN3vOxIEvAfbu8oio-XgKqo');
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Hi');
    console.log("Success! Response: ", result.response.text());
  } catch (e) {
    console.error('Error with gemini-2.5-flash:', e.message);
  }
}
run();
