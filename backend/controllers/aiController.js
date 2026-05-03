const { GoogleGenerativeAI } = require('@google/generative-ai');

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ 
        success: true,
        reply: 'I am not fully configured yet! The site administrator needs to add a GEMINI_API_KEY to the backend .env file or environment variables.' 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey.trim());
    
    // Using the verified available model for your key
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Format previous history for Gemini
    let formattedHistory = history && Array.isArray(history) ? history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Gemini requires the history to start with a 'user' message. 
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    // Start a chat session
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Add system instruction as a prefix to the first message if it's a new chat
    const systemPrompt = `Assistant for BloodLink Portal. Help with blood donation/requests. Be empathetic. User says: ${message}`;

    // Send the message
    const result = await chat.sendMessage(systemPrompt);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      reply: responseText,
    });

  } catch (error) {
    console.error('AI Chat Error Details:', {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      stack: error.stack
    });
    
    res.status(500).json({ 
      success: false, 
      message: 'The AI service is currently unavailable. Please check your API key or model configuration.',
      error: error.message 
    });
  }
};

module.exports = {
  chatWithAI
};
