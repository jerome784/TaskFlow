import { Users, FolderKanban, Activity, ArrowUpRight } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', completed: 12, new: 5 },
  { name: 'Tue', completed: 19, new: 8 },
  { name: 'Wed', completed: 15, new: 10 },
  { name: 'Thu', completed: 22, new: 4 },
  { name: 'Fri', completed: 30, new: 2 },
];

export default function TeamDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-vintage-brown/20 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vintage-charcoal mb-2">Team Overview</h1>
          <p className="text-vintage-charcoal/70">Track your team's collective progress.</p>
        </div>
        <div className="flex -space-x-2">
          {['A','B','C','D'].map((initial, i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-vintage-cream bg-vintage-olive flex items-center justify-center text-sm font-bold text-vintage-cream shadow-sm z-10 relative hover:z-20 hover:-translate-y-1 transition-transform cursor-pointer">
              {initial}
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-vintage-cream bg-vintage-beige flex items-center justify-center text-sm font-bold text-vintage-brown shadow-sm z-10 relative">
            +3
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Widget title="Active Projects" value="8" trend="+2 this week" icon={FolderKanban} />
        <Widget title="Tasks Completed" value="142" trend="+12% vs last week" icon={Activity} />
        <Widget title="Team Velocity" value="High" trend="On track for Q3" icon={ArrowUpRight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 vintage-card p-6 h-[400px] flex flex-col">
          <h2 className="text-xl font-serif font-bold mb-6">Velocity Chart</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 111, 71, 0.2)" vertical={false} />
                <XAxis dataKey="name" stroke="#8B6F47" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8B6F47" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(139, 111, 71, 0.05)'}}
                  contentStyle={{ backgroundColor: '#F5EFE6', borderColor: 'rgba(139, 111, 71, 0.2)', color: '#2E2A26', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="completed" fill="#556B2F" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar dataKey="new" fill="#C8A96B" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="vintage-card p-6 flex flex-col">
          <h2 className="text-xl font-serif font-bold mb-6">Recent Activity</h2>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            <ActivityItem user="Alice" action="completed task" target="Update Onboarding UI" time="10m ago" />
            <ActivityItem user="Bob" action="commented on" target="Backend API Spec" time="1h ago" />
            <ActivityItem user="Charlie" action="moved" target="Database Migration" time="3h ago" status="In Progress" />
            <ActivityItem user="Diana" action="created project" target="Q4 Marketing Strategy" time="1d ago" />
            <ActivityItem user="Alice" action="completed task" target="Fix navigation bug" time="1d ago" />
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
