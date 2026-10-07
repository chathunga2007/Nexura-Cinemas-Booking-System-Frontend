import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  ChevronDown 
} from 'lucide-react';
import { aiApi } from '../services/api';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  time: string;
  content: string;
}

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: 'assistant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: "Hello cinephile! I'm your **Nexura AI Cinema Concierge** powered by Groq LLaMA 3.3.\n\nAsk me for movie recommendations, prime IMAX seats, or gourmet snack pairings!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: '🎬 Top Movies Today', prompt: 'What are the top recommended movies playing today in IMAX?' },
    { label: '✨ IMAX vs Dolby', prompt: 'What is the difference between IMAX 3D and Dolby Atmos screens?' },
    { label: '🍿 Popcorn & Snacks', prompt: 'What delicious popcorn combos and gourmet snacks can I pre-order?' },
    { label: '🎟️ Seat Hold & Refund', prompt: 'How does the 10-minute seat hold and ticket refund work?' }
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: text, time: userTime };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      const reply = await aiApi.chatWithAi(text, historyPayload);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          time: botTime,
          content: reply || "I'm always here to assist your Nexura cinematic journey!"
        }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: "I'm having a brief connection pause, but feel free to browse our active blockbusters directly on the home page!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: "Chat refreshed! How can I assist you with your movie plans today?"
      }
    ]);
  };

  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={line.startsWith('•') ? 'pl-2 text-slate-200 my-0.5' : 'my-1'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="text-white font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Expandable Chat Window */}
      {isOpen ? (
        <div className="w-[92vw] sm:w-[400px] h-[560px] bg-slate-950/95 border border-rose-500/30 rounded-3xl shadow-2xl shadow-rose-950/60 flex flex-col overflow-hidden backdrop-blur-2xl animate-in slide-in-from-bottom-6 fade-in duration-300">
          
          {/* Header */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/60 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5 animate-pulse" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white font-['Outfit'] flex items-center gap-1.5">
                  Nexura AI Concierge
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <span className="text-emerald-400 font-semibold">Online</span>
                  <span>•</span>
                  <span>Groq LLaMA 3.3</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Restart conversation"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-600/30 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[82%] flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md ${
                      m.role === 'user'
                        ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-tr-none'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800/80 rounded-tl-none backdrop-blur-md'
                    }`}
                  >
                    {m.role === 'assistant' ? renderFormattedContent(m.content) : m.content}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">
                    {m.time}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800/80 flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-all font-medium shrink-0"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about movies, seats, or snacks..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white flex items-center justify-center disabled:opacity-40 shadow-lg shadow-rose-600/30 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      ) : (
        /* Small Elegant Circular Floating Action Button (FAB) */
        <button
          onClick={() => setIsOpen(true)}
          title="Ask Nexura AI Concierge"
          className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white shadow-2xl shadow-rose-600/50 hover:shadow-rose-600/80 hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-rose-400/40 flex items-center justify-center"
        >
          {/* Subtle glowing ring and online dot */}
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute top-0.5 right-0.5" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-0.5 right-0.5 border border-slate-950" />
          
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform drop-shadow" />
        </button>
      )}

    </div>
  );
}
