import { useQuery } from "@tanstack/react-query";
import { FolderKanban, Activity, ArrowUpRight } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { reportsApi } from "../../api/reports";
import { projectsApi } from "../../api/projects";
import { activityLogsApi } from "../../api/activityLogs";
import { apiErrorMessage } from "../../api/client";

export default function TeamDashboard() {
  const { data: summary, isLoading: reportsLoading, error: reportsError } = useQuery({
    queryKey: ["reports", "summary"],
    queryFn: reportsApi.summary,
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.list,
  });
  const { data: logs = [] } = useQuery({
    queryKey: ["activityLogs"],
    queryFn: activityLogsApi.latest,
    retry: false,
  });

  const chartData = Object.entries(summary?.tasksByStatus || {}).map(([name, value]) => ({
    name: name.replaceAll("_", " "),
    tasks: value,
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Team Overview</h1>
          <p className="text-vintage-charcoal/70">Track your team's collective progress.</p>
        </div>
        <div className="flex -space-x-2">
          {(summary?.tasksByAssignee || []).slice(0, 4).map((member, i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-vintage-cream bg-vintage-olive flex items-center justify-center text-sm font-bold text-vintage-cream shadow-sm z-10 relative hover:z-20 hover:-translate-y-1 transition-transform cursor-pointer">
              {(member.name || "U").charAt(0)}
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-vintage-cream bg-vintage-beige flex items-center justify-center text-sm font-bold text-vintage-brown shadow-sm z-10 relative">
            +{Math.max((summary?.tasksByAssignee?.length || 0) - 4, 0)}
          </div>
        </div>
      </div>

      {reportsError && (
        <div className="vintage-card p-4 text-red-700">{apiErrorMessage(reportsError, "Unable to load dashboard reports.")}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Widget title="Active Projects" value={projects.length} trend="Live from backend" icon={FolderKanban} />
        <Widget title="Tasks Completed" value={summary?.completedTasks ?? 0} trend={`${summary?.totalTasks ?? 0} total tasks`} icon={Activity} />
        <Widget title="Overdue Tasks" value={summary?.overdueTasks ?? 0} trend={reportsLoading ? "Loading..." : "Needs attention"} icon={ArrowUpRight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 vintage-card p-6 h-[400px] flex flex-col">
          <h2 className="text-xl font-serif font-bold mb-6">Velocity Chart</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 111, 71, 0.2)" vertical={false} />
                <XAxis dataKey="name" stroke="#8B6F47" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B6F47" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(139, 111, 71, 0.05)'}}
                  contentStyle={{ backgroundColor: '#F5EFE6', borderColor: 'rgba(139, 111, 71, 0.2)', color: '#2E2A26', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="tasks" fill="#556B2F" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="vintage-card p-6 flex flex-col">
          <h2 className="text-xl font-serif font-bold mb-6">Recent Activity</h2>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            {logs.slice(0, 8).map((log) => (
              <ActivityItem
                key={log.id}
                user={log.actor?.name || "System"}
                action={log.action.replaceAll("_", " ").toLowerCase()}
                target={log.details}
                time={new Date(log.createdAt).toLocaleString()}
              />
            ))}
            {logs.length === 0 && (
              <p className="text-sm text-vintage-brown">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Widget({ title, value, trend, icon: Icon }) {
  return (
    <div className="vintage-card p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-vintage-brown">{title}</span>
        <div className="w-8 h-8 rounded bg-vintage-brown/10 flex items-center justify-center text-vintage-brown">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <span className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">{value}</span>
      <span className="text-xs font-medium text-vintage-olive">{trend}</span>
    </div>
  );
}

function ActivityItem({ user, action, target, time, status }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-vintage-brown/10 last:border-0 last:pb-0">
      <div className="w-8 h-8 rounded-full bg-vintage-olive/20 flex-shrink-0 flex items-center justify-center text-xs font-bold text-vintage-olive mt-0.5">
        {user.charAt(0)}
      </div>
      <div>
        <p className="text-sm text-vintage-charcoal">
          <span className="font-bold">{user}</span> {action} <span className="font-serif italic text-vintage-brown">{target}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-vintage-brown/70">{time}</span>
          {status && (
            <span className="text-[10px] px-2 py-0.5 rounded border border-vintage-brown/30 bg-vintage-brown/5 uppercase tracking-wider font-bold text-vintage-brown">
              {status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
