import { BookOpen } from "lucide-react";

export default function Journal() {
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Daily Journal</h1>
          <p className="text-vintage-charcoal/70">{date}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-vintage-brown/10 flex items-center justify-center text-vintage-brown">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1 vintage-card p-8 flex flex-col relative overflow-hidden">
        {/* Subtle lined paper background */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139, 111, 71, 0.1) 31px, rgba(139, 111, 71, 0.1) 32px)', backgroundPositionY: '8px' }}></div>
        
        <textarea 
          className="flex-1 w-full bg-transparent resize-none focus:outline-none text-vintage-charcoal leading-[32px] text-lg font-serif z-10"
          placeholder="Dear diary, today I..."
          defaultValue="The morning started with a quiet cup of coffee. I finally managed to refactor the main dashboard component. The new vintage aesthetic is really coming together..."
        ></textarea>
        
        <div className="flex justify-end mt-4 z-10">
          <button className="vintage-btn-primary">Save Entry</button>
        </div>
      </div>
    </div>
  );
}
