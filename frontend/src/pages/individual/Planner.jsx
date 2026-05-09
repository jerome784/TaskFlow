import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Target } from "lucide-react";
import { tasksApi } from "../../api/tasks";
import { useAuthStore } from "../../store/authStore";
import TaskDetailsModal from "../../components/features/TaskDetailsModal";

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setHours(-24 * (day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Planner() {
  const { user } = useAuthStore();
  const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));
  const [selectedTask, setSelectedTask] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.list,
  });

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePrevWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() - 7);
    setCurrentWeekStart(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + 7);
    setCurrentWeekStart(d);
  };

  const myTasks = tasks.filter(t => t.assignee?.id === user?.id);

  const weekTasks = myTasks.filter(t => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due >= weekDays[0] && due <= weekDays[6];
  });

  const formatDateLabel = () => {
    const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Weekly Planner</h1>
          <p className="text-vintage-charcoal/70">Organize your time and set your intentions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-vintage-cream border border-vintage-brown/20 rounded-lg p-1">
            <button onClick={handlePrevWeek} className="p-1 hover:bg-vintage-brown/10 rounded text-vintage-brown"><ChevronLeft className="w-5 h-5" /></button>
            <span className="text-sm font-medium px-2">{formatDateLabel()}</span>
            <button onClick={handleNextWeek} className="p-1 hover:bg-vintage-brown/10 rounded text-vintage-brown"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, idx) => {
          const isToday = date.getTime() === today.getTime();
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = date.getDate();
          return (
            <div key={idx} className={`flex flex-col items-center pb-4 border-b-2 ${isToday ? 'border-vintage-olive text-vintage-olive' : 'border-transparent text-vintage-brown'}`}>
              <span className="text-xs font-bold uppercase tracking-widest mb-1">{dayName}</span>
              <span className={`text-xl font-serif ${isToday ? 'font-bold' : ''}`}>{dayNum}</span>
            </div>
          );
        })}
      </div>

      <div className="vintage-card p-6 min-h-[500px]">
        <div className="space-y-4 relative">
          <div className="absolute left-[80px] top-0 bottom-0 w-px bg-vintage-brown/10"></div>
          
          {isLoading ? (
            <p className="text-sm text-vintage-brown ml-24">Loading tasks...</p>
          ) : weekTasks.length === 0 ? (
            <p className="text-sm text-vintage-brown ml-24 italic">No tasks due this week.</p>
          ) : (
            weekTasks.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate)).map(task => {
              const due = new Date(task.dueDate);
              const dayName = due.toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <div key={task.id} className="flex group" onClick={() => setSelectedTask(task)}>
                  <div className="w-[80px] flex-shrink-0 text-xs text-vintage-brown pt-3 pr-4 text-right font-medium uppercase tracking-wider">
                    {dayName}
                  </div>
                  <div className={`flex-1 rounded-xl border p-4 relative overflow-hidden transition-all hover:shadow-md cursor-pointer ml-4 ${task.status === 'Done' ? 'bg-vintage-brown/5 border-vintage-brown/20 opacity-70' : 'bg-vintage-cream border-vintage-brown/30 hover:border-vintage-olive/50'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`font-serif font-bold ${task.status === 'Done' ? 'text-vintage-brown line-through' : 'text-vintage-charcoal'}`}>{task.title}</h4>
                        <p className="text-xs text-vintage-brown mt-1">Status: {task.status} • Priority: {task.priority}</p>
                      </div>
                      <Target className="w-4 h-4 text-vintage-brown opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
