import { Check, Plus } from "lucide-react";

export default function Habits() {
  const habits = [
    { name: "Read 30 mins", streak: 12, completedToday: true },
    { name: "Morning Exercise", streak: 5, completedToday: false },
    { name: "Meditate", streak: 28, completedToday: true },
    { name: "Drink Water (2L)", streak: 1, completedToday: false },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Habits</h1>
          <p className="text-vintage-charcoal/70">Build consistency, one day at a time.</p>
        </div>
        <button className="vintage-btn-primary flex items-center gap-2 py-2">
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit, i) => (
          <div key={i} className="vintage-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <button className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${habit.completedToday ? 'bg-vintage-olive border-vintage-olive text-vintage-cream' : 'border-vintage-brown/30 text-transparent hover:border-vintage-olive/50 group-hover:bg-vintage-olive/5'}`}>
                <Check className="w-5 h-5" />
              </button>
              <div>
                <h3 className={`font-serif font-bold text-lg ${habit.completedToday ? 'text-vintage-charcoal' : 'text-vintage-charcoal'}`}>{habit.name}</h3>
                <p className="text-sm text-vintage-brown flex items-center gap-1">
                  <span className="text-orange-500">🔥</span> {habit.streak} day streak
                </p>
              </div>
            </div>
            {/* Mini calendar placeholder */}
            <div className="hidden sm:flex gap-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className={`w-3 h-8 rounded-sm ${j === 4 && !habit.completedToday ? 'bg-vintage-brown/10' : 'bg-vintage-olive/60'}`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
