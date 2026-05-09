import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, MoreVertical, Plus } from "lucide-react";
import { projectsApi } from "../api/projects";
import { apiErrorMessage } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function Projects() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const canManageProjects = user?.role === "ADMIN" || user?.role === "MANAGER";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.list,
  });

  const createProject = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
    },
  });

  const handleCreateProject = () => {
    if (!formData.name.trim()) return;
    createProject.mutate(formData);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Projects</h1>
          <p className="text-slate-400">Manage your team's projects and workspaces.</p>
        </div>
        {canManageProjects && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        )}
      </div>

      {isLoading && <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-300">Loading projects...</div>}
      {error && <div className="bg-slate-900 border border-red-900 rounded-xl p-6 text-red-300">{apiErrorMessage(error, "Unable to load projects.")}</div>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-400">
              No projects yet.
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Create Project</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                <input
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  className="w-full min-h-28 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              {createProject.error && (
                <div className="rounded-lg border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">
                  {apiErrorMessage(createProject.error, "Unable to create project.")}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100">
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={createProject.isPending}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                {createProject.isPending ? "Saving..." : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  const members = project.teamMembers || [];
  const status = "Active";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
          <FolderKanban className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
        </div>
        <button className="text-slate-500 hover:text-slate-300">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-lg font-semibold text-slate-100 mb-2">{project.name}</h3>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description || "No description yet."}</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs px-2 py-1 rounded-full border font-medium text-blue-400 bg-blue-400/10 border-blue-400/20">
            {status}
          </span>
          <span className="text-slate-400 font-medium">{members.length} members</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((member) => (
              <div key={member.id} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                {(member.name || "U").charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-xs text-slate-500">{project.manager?.name ? `Managed by ${project.manager.name}` : "No manager"}</span>
        </div>
      </div>
    </div>
  );
}
