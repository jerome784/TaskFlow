import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, Target, Coffee, CheckSquare, ChevronLeft, ChevronRight, Plus, Check } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { tasksApi } from "../../api/tasks";
import { habitsApi } from "../../api/habits";
import { journalApi } from "../../api/journal";
import TaskDetailsModal from "../../components/features/TaskDetailsModal";

export default function PersonalDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Helper to account for local timezone offset when getting ISO date string
  const getLocalDateString = (date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const dateStr = getLocalDateString(currentDate);
  const dateLabel = currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Fetch Tasks for the selected date
  const { data: allTasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.list,
  });

  const todaysTasks = allTasks.filter(t => t.dueDate === dateStr && t.assignee?.id === user.id);
  const completedTasksCount = todaysTasks.filter(t => t.status === "DONE").length;

  // Fetch Habits for the selected date
  const { data: habits = [] } = useQuery({
    queryKey: ["habits", dateStr],
    queryFn: () => habitsApi.list(dateStr),
  });
  
  // Calculate highest streak
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Fetch Journal for selected date
  const { data: journalContent } = useQuery({
    queryKey: ["journal", dateStr],
    queryFn: () => journalApi.getEntry(dateStr),
  });

  const createTask = useMutation({
    mutationFn: (title) => tasksApi.create({
      title,
      dueDate: dateStr,
      assigneeId: user.id
    }),
    onSuccess: () => {
      setNewTaskTitle("");
      setIsAddingTask(false);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  const toggleTaskStatus = useMutation({
    mutationFn: (task) => tasksApi.updateStatus(task.id, task.status === 'DONE' ? 'TODO' : 'DONE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });

  const handleDateChange = (days) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask.mutate(newTaskTitle);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-vintage-brown/20 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => handleDateChange(-1)} className="p-1 hover:bg-vintage-brown/10 rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-vintage-brown" />
            </button>
            <p className="text-vintage-brown font-medium tracking-wide uppercase text-xs w-48 text-center">{dateLabel}</p>
            <button onClick={() => handleDateChange(1)} className="p-1 hover:bg-vintage-brown/10 rounded transition-colors">
              <ChevronRight className="w-5 h-5 text-vintage-brown" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="text-xs text-vintage-olive hover:underline ml-2">Today</button>
          </div>
          <h1 className="text-4xl font-serif font-bold text-vintage-charcoal mb-2 transition-all">
            Good morning, {user?.name?.split(' ')[0] || 'Friend'}.
          </h1>
          <p className="text-vintage-charcoal/70">What shall we focus on?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="Focus Tasks" value={todaysTasks.length} icon={Target} />
        <Widget title="Tasks Done" value={`${completedTasksCount} / ${todaysTasks.length}`} icon={CheckSquare} />
        <Widget title="Best Streak" value={`${bestStreak} Days`} icon={Coffee} />
        <Widget title="Journaled" value={journalContent ? "Yes" : "No"} icon={Book} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">Agenda</h2>
            <button onClick={() => setIsAddingTask(!isAddingTask)} className="text-sm font-medium text-vintage-olive hover:text-vintage-olive/80 flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
          <div className="vintage-card p-2">
            {isAddingTask && (
              <form onSubmit={handleAddTask} className="flex gap-2 p-2 mb-2 border-b border-vintage-brown/10">
                <input 
                  type="text" 
                  className="vintage-input flex-1 text-sm" 
                  placeholder="E.g. Morning Walk..."
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="vintage-btn-primary px-3 py-1 text-sm" disabled={createTask.isPending || !newTaskTitle.trim()}>
                  Add
                </button>
              </form>
            )}

            {todaysTasks.map(task => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 border-b last:border-0 border-vintage-brown/10 hover:bg-vintage-brown/5 transition-colors cursor-pointer group"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskStatus.mutate(task);
                    }}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.status === 'DONE' ? 'bg-vintage-olive border-vintage-olive text-vintage-cream' : 'border-vintage-brown/30 group-hover:border-vintage-olive/50'}`}
                  >
                    {task.status === 'DONE' && <Check className="w-3 h-3" />}
                  </button>
                  <div>
                    <p className={`font-medium ${task.status === 'DONE' ? 'line-through text-vintage-brown/50' : 'text-vintage-charcoal'}`}>{task.title}</p>
                    <p className="text-xs text-vintage-brown mt-0.5">{task.project ? task.project.name : 'Personal'}</p>
                  </div>
                </div>
                {task.priority && (
                  <span className="text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider text-vintage-brown bg-vintage-brown/10 border-vintage-brown/20">
                    {task.priority}
                  </span>
                )}
              </div>
            ))}
            {todaysTasks.length === 0 && !isAddingTask && (
              <div className="p-8 text-center text-vintage-brown italic">
                No tasks scheduled for this day. Enjoy your free time or add a task!
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold">Mood & Insights</h2>
          <div className="vintage-card p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-vintage-gold/30 flex items-center justify-center">
              <span className="text-4xl">{completedTasksCount === todaysTasks.length && todaysTasks.length > 0 ? "🌟" : "🌿"}</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">
                {completedTasksCount === todaysTasks.length && todaysTasks.length > 0 
                  ? "Perfect Day!" 
                  : "Productivity is Blooming"}
              </h3>
              <p className="text-sm text-vintage-brown mt-2">
                {todaysTasks.length > 0 
                  ? `You have completed ${completedTasksCount} out of ${todaysTasks.length} tasks.`
                  : "A clear schedule. A fresh mind."}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}

function Widget({ title, value, icon: Icon }) {
  return (
    <div className="vintage-card p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded bg-vintage-olive/10 flex items-center justify-center text-vintage-olive">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-vintage-brown">{title}</span>
      </div>
      <span className="text-2xl font-serif font-bold text-vintage-charcoal">{value}</span>
    </div>
  );
}
