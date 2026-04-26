import { useState, useEffect } from "react";
import { Play, Pause, Square, X } from "lucide-react";

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
      // Play a sound or notify here
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
    <div className="fixed bottom-6 right-6 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-5 z-50 animate-in slide-in-from-bottom-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Focus Mode
        </h3>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-xs text-slate-400 mb-1">Current Task</p>
        <p className="text-sm font-medium text-slate-200 truncate">{task?.title || "Unknown Task"}</p>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-emerald-400 font-mono">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={resetTimer}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          title="Reset"
        >
          <Square className="w-4 h-4" />
        </button>
        <button 
          onClick={toggleTimer}
          className="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-transform active:scale-95 shadow-lg shadow-blue-500/20"
        >
          {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
        </button>
      </div>
    </div>
  );
}
