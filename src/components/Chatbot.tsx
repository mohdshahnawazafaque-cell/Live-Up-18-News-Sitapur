import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: language === 'hi' ? 'नमस्ते! मैं Live Up 18 News का असिस्टेंट हूँ। मैं आपकी कैसे मदद कर सकता हूँ?' : 'Hello! I am the Live Up 18 News Assistant. How can I help you today?',
          sender: 'bot'
        }
      ]);
    }
  }, [isOpen, language, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();
      
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: data.reply, sender: 'bot' }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Sorry, I am having trouble connecting right now.', sender: 'bot' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Sorry, a network error occurred.', sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 z-50 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-red-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />
              <h3 className="font-bold">Live Up 18 Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-red-200 transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 p-4 h-80 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-red-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'hi' ? 'अपना संदेश लिखें...' : 'Type a message...'}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:hover:bg-red-600 flex items-center justify-center shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}