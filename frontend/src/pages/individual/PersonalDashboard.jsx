import { Book, Target, Coffee, CheckSquare } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function PersonalDashboard() {
  const { user } = useAuthStore();
  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-vintage-brown/20 pb-6">
        <p className="text-vintage-brown font-medium tracking-wide uppercase text-xs mb-2">{date}</p>
        <h1 className="text-4xl font-serif font-bold text-vintage-charcoal mb-2">
          Good morning, {user?.name?.split(' ')[0] || 'Friend'}.
        </h1>
        <p className="text-vintage-charcoal/70">What shall we focus on today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Widget title="Daily Focus" value="Deep Work" icon={Target} />
        <Widget title="Tasks Done" value="3 / 5" icon={CheckSquare} />
        <Widget title="Habit Streak" value="12 Days" icon={Coffee} />
        <Widget title="Journal Entries" value="48" icon={Book} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">Today's Agenda</h2>
            <button className="text-sm font-medium text-vintage-olive hover:text-vintage-olive/80">View Planner</button>
          </div>
          <div className="vintage-card p-2">
            <AgendaItem title="Morning Pages" time="08:00 AM" status="done" />
            <AgendaItem title="Design System Review" time="10:00 AM" priority="High" />
            <AgendaItem title="Focus Block: Development" time="01:00 PM" priority="Urgent" />
            <AgendaItem title="Evening Walk" time="06:00 PM" />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold">Mood & Insights</h2>
          <div className="vintage-card p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full border-4 border-vintage-gold/30 flex items-center justify-center">
              <span className="text-4xl">🌿</span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg">Productivity is Blooming</h3>
              <p className="text-sm text-vintage-brown mt-2">You've maintained a steady pace this week. Keep nurturing your habits.</p>
            </div>
          </div>
        </div>
      </div>
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

function AgendaItem({ title, time, priority, status }) {
  const priorityColors = {
    Urgent: "text-red-700 bg-red-100 border-red-200",
    High: "text-orange-700 bg-orange-100 border-orange-200",
    Medium: "text-vintage-olive bg-vintage-olive/10 border-vintage-olive/20",
    Low: "text-vintage-brown bg-vintage-brown/10 border-vintage-brown/20",
  };

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-0 border-vintage-brown/10 hover:bg-vintage-brown/5 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-5 h-5 rounded border ${status === 'done' ? 'bg-vintage-olive border-vintage-olive text-vintage-cream flex items-center justify-center' : 'border-vintage-brown/30'}`}>
          {status === 'done' && <CheckSquare className="w-3 h-3" />}
        </div>
        <div>
          <p className={`font-medium ${status === 'done' ? 'line-through text-vintage-brown/50' : 'text-vintage-charcoal'}`}>{title}</p>
          <p className="text-xs text-vintage-brown mt-0.5">{time}</p>
        </div>
      </div>
      {priority && (
        <span className={`text-[10px] px-2 py-1 rounded border uppercase font-bold tracking-wider ${priorityColors[priority]}`}>
          {priority}
        </span>
      )}
    </div>
  );
}
