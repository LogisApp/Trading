
import React, { useState, useRef, useEffect } from 'react';
import { chatWithLens } from '../services/geminiService';
import { WyckoffAnalysis, ChatMessage } from '../types';

interface ChatInterfaceProps {
  currentAnalysis?: WyckoffAnalysis;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentAnalysis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatWithLens(userMsg, currentAnalysis);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "No pude procesar eso. Intenta preguntar sobre fases específicas de Wyckoff." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error al conectar con la capa de inteligencia. Revisa tu conexión." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <h3 className="font-bold text-sm">Asistente Wyckoff Lens</h3>
        </div>
        <button 
          onClick={() => setMessages([])} 
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Borrar Chat
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
              <i className="fa-solid fa-comments text-xl"></i>
            </div>
            <p className="text-sm text-slate-500">
              Pregúntame sobre "Springs", "Absorción" o la lógica del gráfico actual.
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700 flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-950/50 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors pr-12"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-lg disabled:opacity-50 hover:bg-indigo-500 transition-colors"
          >
            <i className="fa-solid fa-paper-plane text-xs text-white"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
