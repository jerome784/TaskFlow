import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Clock, Target } from "lucide-react";
import FocusTimer from "../components/FocusTimer";
import { cn } from "../utils/utils";

const mockTasks = [
  { id: 1, title: "Update API documentation", status: "In Progress", priority: "High", assignee: "User A" },
  { id: 2, title: "Fix navigation bug", status: "Done", priority: "Medium", assignee: "User B" },
  { id: 3, title: "Design new landing page", status: "To Do", priority: "High", assignee: "User A" },
  { id: 4, title: "Setup CI/CD pipeline", status: "Done", priority: "Critical", assignee: "User C" },
  { id: 5, title: "Write unit tests for Auth", status: "To Do", priority: "Low", assignee: "User B" },
];

export default function Tasks() {
  const [activeFocusTask, setActiveFocusTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Tasks</h1>
          <p className="text-slate-400">Manage and track your team's work.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="bg-slate-950/50 text-slate-300 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Task Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Assignee</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockTasks.map((task) => (
              <tr key={task.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200">{task.title}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold border",
                    task.status === "Done" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                    task.status === "In Progress" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" :
                    "text-slate-400 bg-slate-800 border-slate-700"
                  )}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-xs font-semibold",
                    task.priority === "Critical" ? "text-red-400" :
                    task.priority === "High" ? "text-orange-400" :
                    task.priority === "Medium" ? "text-blue-400" :
                    "text-slate-500"
                  )}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4">{task.assignee}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => setActiveFocusTask(task)}
                      className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-md transition-colors"
                      title="Start Focus Timer"
                    >
                      <Target className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-slate-400 hover:bg-slate-800 rounded-md transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Focus Timer Overlay */}
      {activeFocusTask && (
        <FocusTimer task={activeFocusTask} onClose={() => setActiveFocusTask(null)} />
      )}

      {/* Task Modal (Simple Mock) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Create New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input type="text" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500">
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Priority</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
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
