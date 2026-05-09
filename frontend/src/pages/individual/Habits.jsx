import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus } from "lucide-react";
import { habitsApi } from "../../api/habits";

export default function Habits() {
  const queryClient = useQueryClient();
  const [newHabitName, setNewHabitName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const todayDateStr = new Date().toISOString().split('T')[0];

  const { data: habits = [] } = useQuery({
    queryKey: ["habits", todayDateStr],
    queryFn: () => habitsApi.list(todayDateStr),
  });

  const createHabit = useMutation({
    mutationFn: (name) => habitsApi.create(name),
    onSuccess: () => {
      setNewHabitName("");
      setIsAdding(false);
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    }
  });

  const toggleHabit = useMutation({
    mutationFn: (id) => habitsApi.toggle(id, todayDateStr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    }
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      createHabit.mutate(newHabitName);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Habits</h1>
          <p className="text-vintage-charcoal/70">Build consistency, one day at a time.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="vintage-btn-primary flex items-center gap-2 py-2">
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="vintage-card p-4 flex gap-4">
          <input 
            type="text" 
            className="vintage-input flex-1" 
            placeholder="What habit do you want to build?"
            value={newHabitName}
            onChange={e => setNewHabitName(e.target.value)}
            autoFocus
          />
          <button type="submit" className="vintage-btn-primary" disabled={createHabit.isPending || !newHabitName.trim()}>
            Save
          </button>
          <button type="button" onClick={() => setIsAdding(false)} className="px-4 text-vintage-brown">Cancel</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((habit) => (
          <div key={habit.id} className="vintage-card p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleHabit.mutate(habit.id)}
                disabled={toggleHabit.isPending}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${habit.completedToday ? 'bg-vintage-olive border-vintage-olive text-vintage-cream' : 'border-vintage-brown/30 text-transparent hover:border-vintage-olive/50 group-hover:bg-vintage-olive/5'}`}
              >
                <Check className="w-5 h-5" />
              </button>
              <div>
                <h3 className={`font-serif font-bold text-lg ${habit.completedToday ? 'text-vintage-charcoal' : 'text-vintage-charcoal'}`}>{habit.name}</h3>
                <p className="text-sm text-vintage-brown flex items-center gap-1">
                  <span className="text-orange-500">🔥</span> {habit.streak} day streak
                </p>
              </div>
            </div>
            <div className="hidden sm:flex gap-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className={`w-3 h-8 rounded-sm ${j === 4 && !habit.completedToday ? 'bg-vintage-brown/10' : 'bg-vintage-olive/60'}`}></div>
              ))}
            </div>
          </div>
        ))}
        {habits.length === 0 && !isAdding && (
          <p className="text-vintage-brown italic col-span-2">You haven't created any habits yet. Start tracking today!</p>
        )}
      </div>
    </div>
  );
}
