import React, { useState } from 'react';
import { MessageCircle, X, Send, ChevronDown, User } from 'lucide-react';

const OandaSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi there, have a question? Enter your question below and a representative will get right back to you.',
      timestamp: new Date()
    }
  ]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (formData.message.trim()) {
      // Add user message
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: formData.message,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      
      // Clear message field
      setFormData({ ...formData, message: '' });
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          text: 'Thank you for your message. A representative will review your inquiry and respond shortly. Is there anything else I can help you with?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  
  };

  return (
    <>
    <button
        onClick={toggleChat}
        className="w-14 h-14 bg-blue-600 hover:bg-blue-700 max-md:bottom-10  text-white fixed bottom-20 right-16 z-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    <div className={`fixed bottom-16 max-md:bottom-7 right-6 z-50 h-[550px] max-md:inset-0 max-md:w-full max-md:h-screen ${isOpen ? 'block' : 'hidden'}`}>
      {/* Chat Widget */}
      {isOpen && (
        <div className="mb-4 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden h-full w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* OANDA Logo */}
              <div className="flex flex-col">
                <div className="flex items-end gap-0.5 mb-1">
                  <div className="w-1.5 h-3 bg-green-500 transform -skew-x-12"></div>
                  <div className="w-1.5 h-4 bg-green-500 transform -skew-x-12"></div>
                  <div className="w-1.5 h-5 bg-blue-400 transform -skew-x-12"></div>
                </div>
                <div className="w-6 h-0.5 bg-green-500"></div>
              </div>
              
              <div>
                <h3 className="text-white font-bold text-lg">OANDA</h3>
                <p className="text-slate-300 text-xs tracking-wider">CUSTOMER SUPPORT</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={toggleChat}
                className="text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages 
          <div className="h-80 overflow-y-auto p-4 bg-slate-900">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex items-start gap-2 max-w-xs">
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`px-3 py-2 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>*/}

          {/* Message Input 
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                name="message"
                placeholder="Type your message..."
                value={formData.message}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSubmit}
                disabled={!formData.message.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}*/}

      {/* Contact Form Widget */}

          {/* Blue Header */}
          
          {/* Form Content */}
          <div className="p-6 ">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className=" text-white px-3 py-2 rounded-lg text-sm">
                Enter your question below and a representative will get right back to you.
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-950 bg-gray-900 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
            
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-950 bg-gray-900 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-950 bg-gray-900 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <p className="text-xs text-gray-600">
                By submitting you agree to receive SMS or e-mails for the provided channel. Rates may be applied.
              </p>
              
              <button
                onClick={handleSubmit}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Submit
              </button>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Powered by <span className="text-red-500 font-medium">Leads Everywhere CRM</span>
            </p>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      

    </div></>
  );
};

export default OandaSupportChat;