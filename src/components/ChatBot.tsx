import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';
import { Settings } from '../types';
import { analyzeWithAI } from '../services/chat';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  settings: Settings;
}

export function ChatBot({ settings }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !settings.apiKey) return;

    const userMessage: Message = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await analyzeWithAI(input, settings);
      const botMessage: Message = {
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        type: 'bot',
        content: "Désolé, je n'ai pas pu analyser votre demande. Veuillez réessayer.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel h-[600px] flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-gray-700/50">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full"></div>
          <MessageSquare className="w-6 h-6 text-indigo-400 relative" />
        </div>
        <h2 className="text-xl font-semibold text-gray-100">Assistant Trading IA</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div className={`p-2 rounded-full ${
              message.type === 'user' ? 'bg-blue-500/20' : 'bg-indigo-500/20'
            }`}>
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-blue-400" />
              ) : (
                <Bot className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            <div className={`flex-1 glass-panel p-4 ${
              message.type === 'user' ? 'bg-blue-500/10' : 'bg-indigo-500/10'
            }`}>
              <p className="text-gray-200 text-sm">{message.content}</p>
              <span className="text-xs text-gray-500 mt-2 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-indigo-500/20">
              <Bot className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="glass-panel p-4 bg-indigo-500/10">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question sur le marché Forex..."
            className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl 
                     text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500/30 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!input.trim() || !settings.apiKey || isLoading}
            className="glass-button bg-indigo-500/20 hover:bg-indigo-500/30 disabled:opacity-50 
                     disabled:cursor-not-allowed px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}