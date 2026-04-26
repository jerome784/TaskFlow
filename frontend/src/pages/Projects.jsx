import { FolderKanban, MoreVertical, Plus } from "lucide-react";

export default function Projects() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Projects</h1>
          <p className="text-slate-400">Manage your team's projects and workspaces.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard 
          title="Website Redesign" 
          desc="Overhauling the main marketing site with new branding."
          progress={75}
          members={3}
          status="Active"
        />
        <ProjectCard 
          title="Mobile App v2" 
          desc="React Native rewrite for the iOS and Android apps."
          progress={30}
          members={5}
          status="At Risk"
        />
        <ProjectCard 
          title="Backend Migration" 
          desc="Moving from legacy REST to GraphQL federation."
          progress={90}
          members={2}
          status="Active"
        />
        <ProjectCard 
          title="Q3 Marketing Campaign" 
          desc="Assets and tracking for the upcoming product launch."
          progress={100}
          members={4}
          status="Completed"
        />
      </div>
    </div>
  );
}

function ProjectCard({ title, desc, progress, members, status }) {
  const statusColors = {
    "Active": "text-blue-400 bg-blue-400/10 border-blue-400/20",
    "At Risk": "text-red-400 bg-red-400/10 border-red-400/20",
    "Completed": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
          <FolderKanban className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
        </div>
        <button className="text-slate-500 hover:text-slate-300">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2">{desc}</p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${statusColors[status]}`}>
            {status}
          </span>
          <span className="text-slate-400 font-medium">{progress}%</span>
        </div>
        
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2">
            {[...Array(members)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                U{i+1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
