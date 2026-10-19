import React, { useState } from 'react';
import { UsagyuunMood, ActivityMetrics } from '../types/watch';
import { generateProceduralUsagyuunSpeech } from '../data/initialData';
import { 
  Sparkles, 
  Heart, 
  Zap, 
  Volume2, 
  VolumeX, 
  PartyPopper, 
  MessageSquare, 
  Radio, 
  Send, 
  Laugh, 
  Flame, 
  Smile, 
  Bot 
} from 'lucide-react';

interface UsagyuunCompanionWidgetProps {
  mood: UsagyuunMood;
  activityMetrics: ActivityMetrics;
  onCheer: () => void;
}

export const UsagyuunCompanionWidget: React.FC<UsagyuunCompanionWidgetProps> = ({
  mood,
  activityMetrics,
  onCheer,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isBoop, setIsBoop] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [currentQuote, setCurrentQuote] = useState<string>(mood.currentQuote);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('random');

  // Web Audio Synthesized Cheerful Chime Effect
  const playCheerfulChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.3);
    } catch (e) {
      console.warn('Web Audio synthesis unpermitted:', e);
    }
  };

  const handleBoop = () => {
    setIsBoop(true);
    playCheerfulChime();
    
    // Generate fresh procedural or category quote
    const newSpeech = generateProceduralUsagyuunSpeech(activeCategory);
    setCurrentQuote(newSpeech);

    onCheer();
    setTimeout(() => setIsBoop(false), 600);
  };

  // AI Speech Generation via Server Endpoint
  const handleAiCheerRequest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAiLoading(true);
    playCheerfulChime();

    try {
      const res = await fetch('/api/usagyuun/cheer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          userText: userInput || 'Cheer me up with explosive positive energy!',
        }),
      });

      const data = await res.json();
      if (data.cheerText) {
        setCurrentQuote(data.cheerText);
      } else {
        setCurrentQuote(generateProceduralUsagyuunSpeech(activeCategory));
      }
    } catch (err) {
      console.warn('Server AI endpoint fallback to procedural engine', err);
      setCurrentQuote(generateProceduralUsagyuunSpeech(activeCategory));
    } finally {
      setIsAiLoading(false);
      setUserInput('');
      onCheer();
    }
  };

  const handleQuickCategory = (cat: string) => {
    setActiveCategory(cat);
    const newSpeech = generateProceduralUsagyuunSpeech(cat);
    setCurrentQuote(newSpeech);
    playCheerfulChime();
    onCheer();
  };

  const progressPercent = Math.min(100, Math.round((activityMetrics.steps / activityMetrics.stepGoal) * 100));

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-pink-500/30 rounded-3xl p-5 shadow-xl relative overflow-hidden space-y-4">
      
      {/* Background Neon Accent Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <span className="text-xs font-black tracking-wider text-pink-300 uppercase flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-pink-400" />
            Usagyuun Infinite Positivity Companion
          </span>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title={soundEnabled ? 'Mute Sound Chimes' : 'Unmute Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* Main Mascot Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* Usagyuun Animated Avatar Box */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-950/60 rounded-2xl border border-pink-500/20 relative group">
          
          <div 
            onClick={handleBoop}
            className={`cursor-pointer transition-transform duration-300 ${
              isBoop ? 'scale-125 rotate-12' : 'hover:scale-105'
            }`}
          >
            {/* SVG Usagyuun Mascot Render */}
            <svg className="w-28 h-28 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]" viewBox="0 0 100 100">
              {/* Ears */}
              <ellipse 
                cx="35" cy="22" rx="7" ry="20" 
                fill="#ffffff" stroke="#f472b6" strokeWidth="3"
                className={`transition-all duration-300 ${isBoop ? '-rotate-12 translate-y-1' : 'animate-bounce'}`}
              />
              <ellipse 
                cx="65" cy="22" rx="7" ry="20" 
                fill="#ffffff" stroke="#f472b6" strokeWidth="3"
                className={`transition-all duration-300 ${isBoop ? 'rotate-12 translate-y-1' : 'animate-bounce delay-100'}`}
              />
              <ellipse cx="35" cy="22" rx="3.5" ry="12" fill="#f472b6" />
              <ellipse cx="65" cy="22" rx="3.5" ry="12" fill="#f472b6" />

              {/* Head */}
              <circle cx="50" cy="55" r="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

              {/* Eyes */}
              <path d="M 38 52 Q 43 45 48 52" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 52 52 Q 57 45 62 52" fill="none" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

              {/* Blush cheeks */}
              <circle cx="36" cy="58" r="4.5" fill="#fb7185" opacity="0.8" />
              <circle cx="64" cy="58" r="4.5" fill="#fb7185" opacity="0.8" />

              {/* Mouth */}
              <path d="M 44 59 Q 50 68 56 59 Z" fill="#f43f5e" />

              {/* Paws */}
              <circle cx="30" cy="72" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
              <circle cx="70" cy="72" r="6" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

              <rect x="25" y="70" width="10" height="4" rx="2" fill="#ec4899" />
            </svg>
          </div>

          <div className="mt-1 text-center">
            <span className="text-[11px] font-extrabold text-pink-300 tracking-wider uppercase block">
              Usagyuun Bunny 🐰
            </span>
            <span className="text-[10px] text-slate-400">
              Tap rabbit for fresh cheer!
            </span>
          </div>
        </div>

        {/* Speech Bubble & Dynamic Cheering Display */}
        <div className="sm:col-span-7 flex flex-col justify-between gap-3">
          
          {/* Live VTuber Speech Bubble */}
          <div className="relative bg-slate-900/90 border border-pink-500/40 p-3.5 rounded-2xl shadow-inner min-h-[85px] flex items-center">
            <div className="flex items-start gap-2 w-full">
              <MessageSquare className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-bold text-slate-100 italic leading-relaxed">
                "{currentQuote}"
              </p>
            </div>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-pink-500/40 hidden sm:block" />
          </div>

          {/* Quick Vibe/Category Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => handleQuickCategory('hype')}
              className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 border border-purple-500/40 text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-yellow-300" /> Hype ⚡
            </button>
            <button
              onClick={() => handleQuickCategory('comfort')}
              className="px-2.5 py-1 bg-pink-600/30 hover:bg-pink-600 text-pink-200 border border-pink-500/40 text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1"
            >
              <Heart className="w-3 h-3 text-rose-400" /> Wholesome 💖
            </button>
            <button
              onClick={() => handleQuickCategory('funny')}
              className="px-2.5 py-1 bg-amber-600/30 hover:bg-amber-600 text-amber-200 border border-amber-500/40 text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1"
            >
              <Laugh className="w-3 h-3 text-yellow-400" /> Funny 😂
            </button>
            <button
              onClick={() => handleQuickCategory('random')}
              className="px-2.5 py-1 bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 border border-cyan-500/40 text-[10px] font-bold rounded-lg shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-300" /> Random 🎲
            </button>
          </div>

          {/* High Five Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBoop}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
              High-Five Usagyuun! ({mood.cheerCount})
            </button>
          </div>

        </div>

      </div>

      {/* Interactive AI Cheer Prompt Input */}
      <form onSubmit={handleAiCheerRequest} className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Tell Usagyuun how you feel (e.g., 'I'm tired', 'Make me laugh!')..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pl-8 text-xs font-semibold text-white focus:outline-none focus:border-pink-500"
          />
          <Bot className="w-4 h-4 text-pink-400 absolute left-2.5 top-2.5" />
        </div>

        <button
          type="submit"
          disabled={isAiLoading}
          className="px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow disabled:opacity-50 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          {isAiLoading ? 'Cheering...' : 'Ask AI'}
        </button>
      </form>

    </div>
  );
};
