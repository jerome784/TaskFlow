import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Target, Columns, List as ListIcon } from "lucide-react";
import FocusTimer from "../components/FocusTimer";
import { cn } from "../utils/utils";

const mockTasks = [
  { id: 1, title: "Update API documentation", status: "In Progress", priority: "High", assignee: "Alice" },
  { id: 2, title: "Fix navigation bug", status: "Done", priority: "Medium", assignee: "Bob" },
  { id: 3, title: "Design new landing page", status: "To Do", priority: "High", assignee: "Alice" },
  { id: 4, title: "Setup CI/CD pipeline", status: "Done", priority: "Urgent", assignee: "Charlie" },
  { id: 5, title: "Write unit tests for Auth", status: "To Do", priority: "Low", assignee: "Bob" },
  { id: 6, title: "Client feedback review", status: "In Progress", priority: "Urgent", assignee: "Diana" },
];

export default function Tasks() {
  const [activeFocusTask, setActiveFocusTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("list"); // 'list' or 'kanban'

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Tasks</h1>
          <p className="text-vintage-charcoal/70">Manage and track your team's work.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="vintage-btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vintage-brown/50" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="vintage-input pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-vintage-cream border border-vintage-brown/20 rounded-lg p-1">
            <button 
              onClick={() => setView('list')}
              className={cn("p-1.5 rounded-md transition-colors", view === 'list' ? 'bg-vintage-olive/10 text-vintage-olive' : 'text-vintage-brown hover:bg-vintage-brown/5')}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('kanban')}
              className={cn("p-1.5 rounded-md transition-colors", view === 'kanban' ? 'bg-vintage-olive/10 text-vintage-olive' : 'text-vintage-brown hover:bg-vintage-brown/5')}
            >
              <Columns className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-vintage-brown/30 bg-transparent hover:bg-vintage-brown/5 text-vintage-charcoal rounded-lg transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {view === 'list' ? <ListView tasks={mockTasks} setActiveFocusTask={setActiveFocusTask} /> : <KanbanView tasks={mockTasks} setActiveFocusTask={setActiveFocusTask} />}
      </div>

      {/* Focus Timer Overlay */}
      {activeFocusTask && (
        <FocusTimer task={activeFocusTask} onClose={() => setActiveFocusTask(null)} />
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-vintage-charcoal/80 backdrop-blur-sm">
          <div className="vintage-card w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold text-vintage-charcoal mb-6">Create New Task</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-vintage-charcoal mb-1">Title</label>
                <input type="text" className="vintage-input" placeholder="What needs to be done?" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-vintage-charcoal mb-1">Status</label>
                  <select className="vintage-input appearance-none">
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-vintage-charcoal mb-1">Priority</label>
                  <select className="vintage-input appearance-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-vintage-brown hover:text-vintage-charcoal transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="vintage-btn-primary"
              >
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListView({ tasks, setActiveFocusTask }) {
  return (
    <div className="vintage-card overflow-hidden shadow-sm flex-1 overflow-y-auto">
      <table className="w-full text-left text-sm text-vintage-charcoal">
        <thead className="bg-vintage-brown/5 text-vintage-brown border-b border-vintage-brown/20 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4 font-bold">Task Title</th>
            <th className="px-6 py-4 font-bold">Status</th>
            <th className="px-6 py-4 font-bold">Priority</th>
            <th className="px-6 py-4 font-bold">Assignee</th>
            <th className="px-6 py-4 font-bold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-b border-vintage-brown/10 hover:bg-vintage-brown/5 transition-colors group">
              <td className="px-6 py-4 font-medium font-serif text-base">{task.title}</td>
              <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
              <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-vintage-olive/20 flex items-center justify-center text-[10px] font-bold text-vintage-olive">
                    {task.assignee.charAt(0)}
                  </div>
                  <span>{task.assignee}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setActiveFocusTask(task)}
                    className="p-1.5 text-vintage-olive hover:bg-vintage-olive/10 rounded-md transition-colors"
                    title="Start Focus Timer"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-vintage-brown hover:bg-vintage-brown/10 rounded-md transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KanbanView({ tasks, setActiveFocusTask }) {
  const columns = ["To Do", "In Progress", "Done"];
  
  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {columns.map(status => (
        <div key={status} className="flex-1 min-w-[300px] flex flex-col bg-vintage-cream/50 rounded-xl border border-vintage-brown/10 p-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-serif font-bold text-vintage-charcoal">{status}</h3>
            <span className="text-xs font-bold text-vintage-brown bg-vintage-brown/10 px-2 py-1 rounded-full">
              {tasks.filter(t => t.status === status).length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3">
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} className="vintage-card p-4 group cursor-pointer hover:border-vintage-olive/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <PriorityBadge priority={task.priority} />
                  <button 
                    onClick={() => setActiveFocusTask(task)}
                    className="text-vintage-brown opacity-0 group-hover:opacity-100 hover:text-vintage-olive transition-all"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-serif font-bold text-vintage-charcoal mb-4 leading-tight">{task.title}</h4>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-vintage-olive/20 flex items-center justify-center text-[10px] font-bold text-vintage-olive">
                      {task.assignee.charAt(0)}
                    </div>
                    <span className="text-xs text-vintage-brown">{task.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
      status === "Done" ? "text-vintage-olive bg-vintage-olive/10 border-vintage-olive/20" :
      status === "In Progress" ? "text-vintage-gold bg-vintage-gold/10 border-vintage-gold/20" :
      "text-vintage-brown bg-vintage-brown/10 border-vintage-brown/20"
    )}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className={cn(
      "text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider",
      priority === "Urgent" ? "text-red-700 bg-red-100 border-red-200" :
      priority === "High" ? "text-orange-700 bg-orange-100 border-orange-200" :
      priority === "Medium" ? "text-blue-700 bg-blue-100 border-blue-200" :
      "text-vintage-brown bg-vintage-brown/10 border-vintage-brown/20"
    )}>
      {priority}
    </span>
  );
}
