import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, MoreHorizontal, Target, Columns, List as ListIcon } from "lucide-react";
import FocusTimer from "../components/FocusTimer";
import TaskDetailsModal from "../components/features/TaskDetailsModal";
import { cn } from "../utils/utils";
import { tasksApi } from "../api/tasks";
import { usersApi } from "../api/users";
import { projectsApi } from "../api/projects";
import { apiErrorMessage } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function Tasks() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [activeFocusTask, setActiveFocusTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("list"); // 'list' or 'kanban'
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
    dueDate: "",
    assigneeId: "",
    projectId: "",
  });

  const canManageTasks = user?.role === "ADMIN" || user?.role === "MANAGER";

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => tasksApi.list(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.list(),
    enabled: canManageTasks,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.list(),
    enabled: canManageTasks,
  });

  const createTask = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setIsModalOpen(false);
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        dueDate: "",
        assigneeId: "",
        projectId: "",
      });
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => tasksApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateTask = () => {
    if (!formData.title.trim()) return;
    createTask.mutate({
      ...formData,
      dueDate: formData.dueDate || null,
      assigneeId: formData.assigneeId ? Number(formData.assigneeId) : null,
      projectId: formData.projectId ? Number(formData.projectId) : null,
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Tasks</h1>
          <p className="text-vintage-charcoal/70">Manage and track your team's work.</p>
        </div>
        {canManageTasks && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="vintage-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Task
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 py-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vintage-brown/50" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="vintage-input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        {isLoading && <div className="vintage-card p-6 text-vintage-brown">Loading tasks...</div>}
        {error && <div className="vintage-card p-6 text-red-700">{apiErrorMessage(error, "Unable to load tasks.")}</div>}
        {!isLoading && !error && (
          view === 'list'
            ? <ListView tasks={filteredTasks} setActiveFocusTask={setActiveFocusTask} updateStatus={updateStatus} setSelectedTask={setSelectedTask} />
            : <KanbanView tasks={filteredTasks} setActiveFocusTask={setActiveFocusTask} updateStatus={updateStatus} setSelectedTask={setSelectedTask} />
        )}
      </div>

      {/* Focus Timer Overlay */}
      {activeFocusTask && (
        <FocusTimer task={activeFocusTask} onClose={() => setActiveFocusTask(null)} />
      )}

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-vintage-charcoal/80 backdrop-blur-sm">
          <div className="vintage-card w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold text-vintage-charcoal mb-6">Create New Task</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-vintage-charcoal mb-1">Title</label>
                <input
                  type="text"
                  className="vintage-input"
                  placeholder="What needs to be done?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-vintage-charcoal mb-1">Description</label>
                <textarea
                  className="vintage-input min-h-24"
                  placeholder="Add useful context for the assignee"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-vintage-charcoal mb-1">Status</label>
                  <select
                    className="vintage-input appearance-none"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-vintage-charcoal mb-1">Priority</label>
                  <select
                    className="vintage-input appearance-none"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-vintage-charcoal mb-1">Assignee</label>
                  <select
                    className="vintage-input appearance-none"
                    value={formData.assigneeId}
                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                  >
                    <option value="">Unassigned</option>
                    {users.map((member) => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-vintage-charcoal mb-1">Project</label>
                  <select
                    className="vintage-input appearance-none"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  >
                    <option value="">No project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-vintage-charcoal mb-1">Due Date</label>
                <input
                  type="date"
                  className="vintage-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              {createTask.error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {apiErrorMessage(createTask.error, "Unable to create task.")}
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-vintage-brown hover:text-vintage-charcoal transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateTask}
                className="vintage-btn-primary"
                disabled={createTask.isPending}
              >
                {createTask.isPending ? "Saving..." : "Save Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListView({ tasks, setActiveFocusTask, updateStatus, setSelectedTask }) {
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
            <tr key={task.id} className="border-b border-vintage-brown/10 hover:bg-vintage-brown/5 transition-colors group cursor-pointer" onClick={() => setSelectedTask(task)}>
              <td className="px-6 py-4 font-medium font-serif text-base">{task.title}</td>
              <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
              <td className="px-6 py-4"><PriorityBadge priority={task.priority} /></td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-vintage-olive/20 flex items-center justify-center text-[10px] font-bold text-vintage-olive">
                    {(task.assignee?.name || "U").charAt(0)}
                  </div>
                  <span>{task.assignee?.name || "Unassigned"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {task.status !== "Done" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: task.id, status: "Done" }); }}
                      className="px-2 py-1 text-xs text-vintage-olive hover:bg-vintage-olive/10 rounded-md transition-colors"
                    >
                      Done
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveFocusTask(task); }}
                    className="p-1.5 text-vintage-olive hover:bg-vintage-olive/10 rounded-md transition-colors"
                    title="Start Focus Timer"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); }} className="p-1.5 text-vintage-brown hover:bg-vintage-brown/10 rounded-md transition-colors">
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

function KanbanView({ tasks, setActiveFocusTask, updateStatus, setSelectedTask }) {
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
              <div key={task.id} className="vintage-card p-4 group cursor-pointer hover:border-vintage-olive/30 transition-colors" onClick={() => setSelectedTask(task)}>
                <div className="flex items-start justify-between mb-3">
                  <PriorityBadge priority={task.priority} />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveFocusTask(task); }}
                    className="text-vintage-brown opacity-0 group-hover:opacity-100 hover:text-vintage-olive transition-all"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-serif font-bold text-vintage-charcoal mb-4 leading-tight">{task.title}</h4>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-vintage-olive/20 flex items-center justify-center text-[10px] font-bold text-vintage-olive">
                      {(task.assignee?.name || "U").charAt(0)}
                    </div>
                    <span className="text-xs text-vintage-brown">{task.assignee?.name || "Unassigned"}</span>
                  </div>
                  {task.status !== "Done" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); updateStatus.mutate({ id: task.id, status: status === "To Do" ? "In Progress" : "Done" }); }}
                      className="text-xs font-bold text-vintage-olive hover:text-vintage-charcoal"
                    >
                      Move
                    </button>
                  )}
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
      priority === "Critical" ? "text-red-700 bg-red-100 border-red-200" :
      priority === "High" ? "text-orange-700 bg-orange-100 border-orange-200" :
      priority === "Medium" ? "text-blue-700 bg-blue-100 border-blue-200" :
      "text-vintage-brown bg-vintage-brown/10 border-vintage-brown/20"
    )}>
      {priority}
    </span>
  );
}
