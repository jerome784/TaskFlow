import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function Planner() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = 2; // Wed

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Weekly Planner</h1>
          <p className="text-vintage-charcoal/70">Organize your time and set your intentions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-vintage-cream border border-vintage-brown/20 rounded-lg p-1">
            <button className="p-1 hover:bg-vintage-brown/10 rounded text-vintage-brown"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-sm font-medium px-2">Oct 14 - Oct 20</span>
            <button className="p-1 hover:bg-vintage-brown/10 rounded text-vintage-brown"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button className="vintage-btn-primary flex items-center gap-2 py-2">
            <Plus className="w-4 h-4" /> Add Block
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, idx) => (
          <div key={day} className={`flex flex-col items-center pb-4 border-b-2 ${idx === currentDay ? 'border-vintage-olive text-vintage-olive' : 'border-transparent text-vintage-brown'}`}>
            <span className="text-xs font-bold uppercase tracking-widest mb-1">{day}</span>
            <span className={`text-xl font-serif ${idx === currentDay ? 'font-bold' : ''}`}>{14 + idx}</span>
          </div>
        ))}
      </div>

      <div className="vintage-card p-6 min-h-[500px]">
        {/* Simplified planner view */}
        <div className="space-y-4 relative">
          <div className="absolute left-[60px] top-0 bottom-0 w-px bg-vintage-brown/10"></div>
          
          <TimeBlock time="08:00 AM" title="Morning Routine" duration="1h" color="bg-vintage-beige border-vintage-brown/20" />
          <TimeBlock time="09:00 AM" title="Deep Work: Coding" duration="2h" color="bg-vintage-olive/10 border-vintage-olive/30" />
          <TimeBlock time="11:30 AM" title="Team Standup" duration="30m" color="bg-blue-50 border-blue-200" />
          <TimeBlock time="01:00 PM" title="Lunch Break" duration="1h" color="bg-vintage-cream border-vintage-brown/20" />
          <TimeBlock time="02:00 PM" title="Client Meeting" duration="1h" color="bg-orange-50 border-orange-200" />
        </div>
      </div>
    </div>
  );
}

function TimeBlock({ time, title, duration, color }) {
  return (
    <div className="flex group">
      <div className="w-[60px] flex-shrink-0 text-xs text-vintage-brown pt-3 pr-4 text-right font-medium">
        {time}
      </div>
      <div className={`flex-1 rounded-xl border p-4 ${color} relative overflow-hidden transition-all hover:shadow-md cursor-pointer ml-4`}>
        <h4 className="font-serif font-bold text-vintage-charcoal">{title}</h4>
        <p className="text-xs text-vintage-brown mt-1">{duration}</p>
      </div>
    </div>
  );
}
