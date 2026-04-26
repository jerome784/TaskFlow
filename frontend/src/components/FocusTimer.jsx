import { useState, useEffect } from "react";
import { Play, Pause, Square, X, Target } from "lucide-react";

export default function FocusTimer({ task, onClose }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 vintage-card p-6 z-50 animate-in slide-in-from-bottom-8 shadow-2xl border-vintage-brown/30">
      <div className="flex items-center justify-between mb-4 border-b border-vintage-brown/10 pb-3">
        <h3 className="text-sm font-serif font-bold text-vintage-charcoal flex items-center gap-2">
          <Target className="w-4 h-4 text-vintage-olive" />
          Focus Mode
        </h3>
        <button onClick={onClose} className="text-vintage-brown hover:text-vintage-charcoal transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6 text-center">
        <p className="text-xs text-vintage-brown mb-1 uppercase tracking-widest font-bold">Current Task</p>
        <p className="text-sm font-medium font-serif text-vintage-charcoal truncate">{task?.title || "Unknown Task"}</p>
      </div>

      <div className="flex flex-col items-center mb-8 relative">
        <div className="w-32 h-32 rounded-full border-4 border-vintage-cream shadow-inner bg-vintage-beige/50 flex items-center justify-center relative overflow-hidden">
          {/* Subtle noise inside the timer face */}
           <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
          </div>
          <div className="text-4xl font-bold font-serif text-vintage-charcoal relative z-10 tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-2 rounded-full hover:bg-vintage-brown/10 text-vintage-brown transition-colors"
          title="Reset"
        >
          <Square className="w-4 h-4" />
        </button>
        <button 
          onClick={toggleTimer}
          className="w-14 h-14 rounded-full bg-vintage-olive text-vintage-cream flex items-center justify-center hover:bg-vintage-olive/90 transition-transform active:scale-95 shadow-md shadow-vintage-olive/20"
        >
          {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
        </button>
      </div>
    </div>
  );
}
