'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: Date;
}

export default function ChatbotWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const predefinedQuestions = [
    {
      question: "What's the difference between free allocation and auction?",
      answer: "Free allocation gives companies allowances at no cost based on their historical emissions or benchmarks. Auctions require companies to bid and pay for allowances at market prices. Free allocation typically decreases over time to encourage emission reductions."
    },
    {
      question: "How does the penalty rate affect compliance?",
      answer: "The penalty rate is the fine per ton of excess emissions if you don't have enough allowances or offsets. A higher penalty rate makes non-compliance more expensive, encouraging players to invest in abatement or purchase more allowances."
    },
    {
      question: "What's the best strategy to reduce emissions?",
      answer: "The optimal strategy depends on your company profile and market conditions. Generally, compare the cost per ton of abatement options with allowance prices. If abatement is cheaper than buying allowances, invest in emission reductions. Also consider banking allowances for future rounds."
    },
    {
      question: "What do the market events do?",
      answer: "Market events simulate real-world policy changes and economic shocks. They can affect allowance prices, emission caps, offset availability, or company budgets. Events like 'Technology Breakthrough' reduce abatement costs, while 'Regulatory Tightening' increases the cap reduction rate."
    },
    {
      question: "How does banking work?",
      answer: "Banking allows you to save unused allowances for future compliance periods. This is useful when allowance prices are expected to rise or when you have surplus allowances. However, there may be limits on how many allowances you can bank."
    },
    {
      question: "What are carbon offsets?",
      answer: "Carbon offsets are credits from emission reduction projects outside the ETS (like forestry or renewable energy). They can be used for compliance but often have limits (e.g., max 10% of emissions). Offsets are typically cheaper than allowances but may have restrictions."
    }
  ];

  const getWelcomeMessage = () => {
    if (user?.isFacilitator) {
      return "Hi Facilitator! Need help setting up your simulation? I can explain configuration options, market events, and best practices for running training sessions.";
    } else {
      return "Hi! Need help understanding the next step? I can explain trading strategies, compliance requirements, and how the simulation works.";
    }
  };

  const handleQuestionClick = (qa: typeof predefinedQuestions[0]) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: qa.question,
      timestamp: new Date()
    };

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      message: qa.answer,
      timestamp: new Date()
    };

    setMessages([userMessage, botMessage]);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    // Find matching predefined answer
    const matchedQA = predefinedQuestions.find(qa => 
      qa.question.toLowerCase().includes(inputMessage.toLowerCase()) ||
      inputMessage.toLowerCase().includes(qa.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );

    const botMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      message: matchedQA?.answer || "I'm a demo assistant with pre-scripted responses. Try asking about allocation methods, penalties, market events, or trading strategies!",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-110"
          title="Simulation Assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold">Simulation Assistant</h3>
                <p className="text-xs text-emerald-100">Demo Helper</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <p className="text-emerald-800 text-sm">{getWelcomeMessage()}</p>
              </div>
            )}

            {/* Sample Questions (shown when no messages) */}
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Sample questions:</p>
                {predefinedQuestions.slice(0, 4).map((qa, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(qa)}
                    className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    "{qa.question}"
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.message}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the simulation..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This is a demo assistant with pre-scripted responses
            </p>
          </div>
        </div>
      )}
    </>
  );
}