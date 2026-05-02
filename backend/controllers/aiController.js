const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure the API key is available
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

/**
 * @desc    Chat with AI Assistant
 * @route   POST /api/ai/chat
 * @access  Public
 */
const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!genAI) {
      return res.status(200).json({ 
        success: true,
        reply: 'I am not fully configured yet! The site administrator needs to add a GEMINI_API_KEY to the backend .env file.' 
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // System instructions context for the blood donation portal
    const systemPrompt = `
      You are a helpful, empathetic, and knowledgeable AI assistant for a Blood Donation Portal called "BloodLink" (or generic blood donation portal).
      Your goal is to assist users with questions about donating blood, receiving blood, eligibility criteria, and navigating the platform.
      
      Key Guidelines:
      - Be polite, concise, and highly informative.
      - If someone asks about blood type compatibility, provide accurate medical facts (e.g., O- is universal donor, AB+ is universal recipient).
      - If asked about the process, briefly explain that they can register as a donor or request blood via the platform's dashboard.
      - Do not provide actual medical diagnoses. Advise consulting a doctor for specific health concerns.
      - Maintain a professional and encouraging tone.

      User's latest message: ${message}
    `;

    // Format previous history for Gemini (if any)
    let formattedHistory = history && Array.isArray(history) ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Gemini requires the history to start with a 'user' message. 
    // If the first message is the default 'model' greeting, we remove it.
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(systemPrompt);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      reply: responseText,
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to communicate with AI',
      error: error.message 
    });
  }
};

module.exports = {
  chatWithAI
};
