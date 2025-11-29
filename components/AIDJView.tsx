import React, { useState, useEffect, useRef } from 'react';
import { Track, ChatMessage } from '../types';
import { getAIPlaylistRecommendation } from '../services/geminiService';
import { Send, Sparkles, Play, Bot } from 'lucide-react';

interface AIDJViewProps {
  onPlayTrack: (track: Track) => void;
}

export const AIDJView: React.FC<AIDJViewProps> = ({ onPlayTrack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hey! I'm your Vibe DJ. Tell me how you're feeling, or what kind of atmosphere you want, and I'll queue up the perfect tracks."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Call Gemini
    const result = await getAIPlaylistRecommendation(userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: result.text,
      recommendedTracks: result.tracks
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMsg]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-full w-full pb-32">
      <div className="px-4 py-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Vibe DJ</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-gray-200 rounded-bl-none'
            }`}>
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              
              {msg.recommendedTracks && msg.recommendedTracks.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recommended</p>
                  {msg.recommendedTracks.map(track => (
                    <button
                      key={track.id}
                      onClick={() => onPlayTrack(track)}
                      className="w-full flex items-center p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors group text-left"
                    >
                      <img src={track.coverUrl} className="w-10 h-10 rounded object-cover" alt="" />
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{track.title}</div>
                        <div className="text-xs text-gray-400 truncate">{track.artist}</div>
                      </div>
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Play size={14} fill="white" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-slate-800 rounded-2xl rounded-bl-none p-4 flex space-x-1 items-center h-12">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900 border-t border-white/10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for a vibe (e.g., 'Late night drive')..."
            className="w-full bg-slate-800 text-white placeholder-gray-500 rounded-full py-3.5 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-indigo-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};