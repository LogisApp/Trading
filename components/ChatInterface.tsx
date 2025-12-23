
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
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsTyping(true);

    try {
      const response = await chatWithLens(text, currentAnalysis);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "No pude procesar eso. Intenta preguntar sobre fases específicas de Wyckoff." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error al conectar con la capa de inteligencia. Revisa tu conexión." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMsg = input.trim();
    setInput('');
    await sendMessage(userMsg);
  };

  const quickActions = [
    { label: 'Resumen Ejecutivo', prompt: 'Dame un resumen ejecutivo detallado del análisis Wyckoff actual centrado en la acción institucional.' },
    { label: 'Resumen Corto', prompt: 'Dame un resumen muy corto y conciso (máximo 2 párrafos) de la situación actual del gráfico.' },
    { label: 'Pregunta Pro', prompt: '¿Qué pregunta clave debería hacerme ahora para validar este escenario y gestionar mi riesgo?' }
  ];

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[550px] shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <h3 className="font-bold text-sm tracking-tight text-slate-200">Asistente Wyckoff Lens</h3>
        </div>
        <button 
          onClick={() => setMessages([])} 
          className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-rose-400 transition-colors"
        >
          Limpiar Historial
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 text-indigo-400">
              <i className="fa-solid fa-robot text-2xl"></i>
            </div>
            <p className="text-sm font-medium text-slate-400">
              Bienvenido al núcleo de análisis.<br/>
              <span className="text-xs text-slate-600 font-normal">¿En qué puedo ayudarte con el gráfico actual?</span>
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-800 p-3.5 rounded-2xl rounded-tl-none border border-slate-700/50 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Botones de Acciones Rápidas */}
      <div className="px-4 pb-2 pt-1 flex flex-wrap gap-2">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(action.prompt)}
            disabled={isTyping}
            className="text-[10px] font-bold uppercase tracking-tight bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-slate-950/50 border-t border-slate-800/50">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="w-full bg-slate-900 border border-slate-700 group-focus-within:border-indigo-500/50 rounded-xl px-4 py-3.5 text-sm text-slate-200 focus:outline-none transition-all pr-12 placeholder:text-slate-600"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-indigo-600 rounded-lg disabled:bg-slate-800 disabled:text-slate-600 hover:bg-indigo-500 transition-all text-white shadow-lg active:scale-90"
          >
            <i className="fa-solid fa-paper-plane text-xs"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
