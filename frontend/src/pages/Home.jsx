import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Target, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-vintage-cream text-vintage-charcoal flex flex-col relative overflow-hidden">
      {/* Subtle Paper Texture Background */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full relative z-10 border-b border-vintage-brown/10">
        <div className="font-serif font-bold text-3xl tracking-tight flex items-center gap-2">
          <span className="text-vintage-olive">⚲</span> TaskFlow
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/login" className="text-vintage-charcoal hover:text-vintage-olive transition-colors font-serif italic text-lg">
            Log in
          </Link>
          <Link
            to="/register"
            className="vintage-btn-primary px-6"
          >
            Start Your Journey
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto mt-20 mb-32 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-vintage-brown/30 bg-vintage-beige text-xs uppercase tracking-widest font-bold text-vintage-brown mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-vintage-olive animate-pulse" />
          The Vintage Update is Live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.1] text-vintage-charcoal">
          Organize your work, <br className="hidden md:block" />
          <span className="italic text-vintage-olive">beautifully.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-vintage-brown mb-12 max-w-2xl font-sans leading-relaxed">
          TaskFlow is an elegant productivity suite designed for those who appreciate the quiet focus of a vintage study. Tailored workspaces for both personal goals and team collaboration.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link
            to="/register"
            className="vintage-btn-primary flex items-center gap-2 px-8 py-4 text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Start building for free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-serif font-bold italic text-lg border-2 border-vintage-brown/20 hover:border-vintage-olive hover:text-vintage-olive text-vintage-brown transition-colors bg-vintage-cream/50 backdrop-blur-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full">
          <Feature 
            title="Personal & Team Modes" 
            desc="Choose your path during onboarding. Build personal habits or manage complex team projects from a unified dashboard."
            icon={Users}
          />
          <Feature 
            title="Focus & Flow" 
            desc="A beautiful, integrated Pomodoro timer keeps you grounded and focused on the task at hand."
            icon={Target}
          />
          <Feature 
            title="Daily Journals" 
            desc="Reflect on your progress with a minimalist, distraction-free journal workspace."
            icon={BookOpen}
          />
        </div>
      </main>

      {/* Decorative botanical element bottom right */}
      <div className="fixed -bottom-32 -right-32 text-[300px] opacity-5 pointer-events-none text-vintage-olive mix-blend-multiply">
        🌿
      </div>
    </div>
  );
}

function Feature({ title, desc, icon: Icon }) {
  return (
    <div className="vintage-card p-8 group hover:-translate-y-1 transition-transform duration-300">
      <div className="w-12 h-12 rounded-full bg-vintage-beige border border-vintage-brown/20 flex items-center justify-center mb-6 group-hover:bg-vintage-olive group-hover:text-vintage-cream group-hover:border-vintage-olive transition-colors text-vintage-brown">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif font-bold text-2xl mb-3 text-vintage-charcoal">{title}</h3>
      <p className="text-vintage-brown text-sm leading-relaxed font-sans">{desc}</p>
    </div>
  );
}
