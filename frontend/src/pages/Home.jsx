import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LayoutDashboard, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="font-bold text-2xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          TaskFlow
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-white text-slate-950 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            Sign up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto mt-20 mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-400 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          TaskFlow v1.0 is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Manage your team's work <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            without the chaos.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
          TaskFlow is a premium SaaS platform designed for high-performing engineering teams. 
          Track tasks, manage projects, and stay focused.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Start building for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-full font-medium border border-slate-800 hover:bg-slate-900 transition-colors text-slate-300"
          >
            View Demo <LayoutDashboard className="w-4 h-4" />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Feature 
            title="Focus Mode" 
            desc="Built-in Pomodoro timers to keep you in the zone and tracking time automatically."
          />
          <Feature 
            title="Command Palette" 
            desc="Navigate at the speed of thought with our global Cmd+K shortcut menu."
          />
          <Feature 
            title="Enterprise Ready" 
            desc="Role-based access control, robust reporting, and secure authentication."
          />
        </div>
      </main>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-5 h-5 text-blue-400" />
      </div>
      <h3 className="font-semibold text-lg mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
