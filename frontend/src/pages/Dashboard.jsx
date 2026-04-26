import { CheckCircle2, Clock, ListTodo, MoreHorizontal } from "lucide-react";
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
  { name: 'Mon', completed: 4, new: 2 },
  { name: 'Tue', completed: 3, new: 5 },
  { name: 'Wed', completed: 7, new: 3 },
  { name: 'Thu', completed: 5, new: 4 },
  { name: 'Fri', completed: 8, new: 1 },
  { name: 'Sat', completed: 2, new: 0 },
  { name: 'Sun', completed: 1, new: 0 },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Tasks" 
          value="24" 
          icon={ListTodo} 
          color="text-blue-400" 
          bg="bg-blue-500/10" 
        />
        <StatCard 
          title="In Progress" 
          value="8" 
          icon={Clock} 
          color="text-amber-400" 
          bg="bg-amber-500/10" 
        />
        <StatCard 
          title="Completed" 
          value="16" 
          icon={CheckCircle2} 
          color="text-emerald-400" 
          bg="bg-emerald-500/10" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-100 mb-6">Task Activity (This Week)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Bar dataKey="completed" fill="#34d399" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="new" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-100">Recent Tasks</h2>
            <button className="text-slate-400 hover:text-slate-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <RecentTask 
              title="Update API documentation" 
              status="In Progress" 
              time="2h ago" 
            />
            <RecentTask 
              title="Fix navigation bug" 
              status="Done" 
              time="4h ago" 
            />
            <RecentTask 
              title="Design new landing page" 
              status="To Do" 
              time="1d ago" 
            />
            <RecentTask 
              title="Setup CI/CD pipeline" 
              status="Done" 
              time="2d ago" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function RecentTask({ title, status, time }) {
  const statusColors = {
    "Done": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    "In Progress": "text-amber-400 bg-amber-400/10 border-amber-400/20",
    "To Do": "text-slate-400 bg-slate-800 border-slate-700"
  };

  return (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-800">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-slate-200">{title}</span>
        <span className="text-xs text-slate-500">{time}</span>
      </div>
      <span className={`text-[10px] px-2 py-1 rounded-full border uppercase font-bold tracking-wider ${statusColors[status]}`}>
        {status}
      </span>
    </div>
  );
}
