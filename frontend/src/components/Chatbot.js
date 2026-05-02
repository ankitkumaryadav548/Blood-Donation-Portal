import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import '../styles/Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi there! 👋 I am the BloodLink AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to our backend, which talks to Gemini
      const res = await api.post('/ai/chat', {
        message: userMessage.text,
        history: messages // pass previous conversation history
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, { role: 'model', text: res.data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'model', text: 'Sorry, I am having trouble understanding right now. Please try again later.' }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [...prev, { role: 'model', text: 'Oops! Cannot connect to the AI server. Make sure the API key is configured.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : ''}`}>
      {/* Chat Toggle Button */}
      <button className="chatbot-toggle" onClick={toggleChat} aria-label="Toggle Chat">
        {isOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-comment-dots"></i>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>AI Assistant</h3>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-bubble ${msg.role === 'user' ? 'user' : 'model'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message-bubble model typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
