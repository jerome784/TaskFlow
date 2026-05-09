import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';
import { reportsApi } from '../api/reports';
import { apiErrorMessage } from '../api/client';
import { useAuthStore } from '../store/authStore';

const COLORS = ['#64748b', '#3b82f6', '#10b981'];
const PRIORITY_COLORS = ['#94a3b8', '#60a5fa', '#f59e0b', '#ef4444'];

export default function Reports() {
  const { token } = useAuthStore();
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: reportsApi.summary,
  });

  const taskStatusData = Object.entries(summary?.tasksByStatus || {}).map(([name, value]) => ({ name: labelize(name), value }));
  const priorityData = Object.entries(summary?.tasksByPriority || {}).map(([name, value]) => ({ name: labelize(name), value }));

  const exportUrl = token
    ? `${reportsApi.exportTasksUrl()}?downloadTokenHint=${encodeURIComponent(token.slice(0, 8))}`
    : reportsApi.exportTasksUrl();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Reports</h1>
          <p className="text-slate-400">Analytics and insights into your team's performance.</p>
        </div>
        <a
          href={exportUrl}
          onClick={(e) => {
            e.preventDefault();
            fetch(reportsApi.exportTasksUrl(), { headers: { Authorization: `Bearer ${token}` } })
              .then((res) => res.blob())
              .then((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'taskflow-tasks.csv';
                link.click();
                URL.revokeObjectURL(url);
              });
          }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV
        </a>
      </div>

      {isLoading && <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-300">Loading reports...</div>}
      {error && <div className="bg-slate-900 border border-red-900 rounded-xl p-6 text-red-300">{apiErrorMessage(error, "Unable to load reports.")}</div>}

      {summary && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard label="Total Tasks" value={summary.totalTasks} />
            <SummaryCard label="Completed" value={summary.completedTasks} />
            <SummaryCard label="Overdue" value={summary.overdueTasks} danger />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartPanel title="Tasks by Status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }} itemStyle={{ color: '#f8fafc' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </ChartPanel>

            <ChartPanel title="Tasks by Priority">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`priority-${entry.name}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, danger }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <p className="text-slate-400 text-sm font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-2 ${danger ? 'text-red-300' : 'text-slate-100'}`}>{value}</p>
    </div>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-100 mb-6">{title}</h2>
      <div className="h-[300px] w-full">{children}</div>
    </div>
  );
}

function labelize(value) {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
