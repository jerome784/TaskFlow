import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, User, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Onboarding() {
  const navigate = useNavigate();
  const { setPurpose } = useAuthStore();
  const [selected, setSelected] = useState(null); // 'TEAM' or 'INDIVIDUAL'

  const handleContinue = () => {
    if (!selected) return;
    setPurpose(selected);
    if (selected === 'TEAM') {
      navigate('/app/team-dashboard');
    } else {
      navigate('/app/personal-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-vintage-cream text-vintage-charcoal flex flex-col items-center justify-center p-6 relative">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vintage-olive/10 mb-8 border border-vintage-olive/20">
          <span className="text-3xl text-vintage-olive font-serif">⚲</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">How will you use TaskFlow?</h1>
        <p className="text-lg text-vintage-brown mb-12">
          We'll customize your workspace to perfectly suit your needs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {/* Individual Option */}
          <button
            onClick={() => setSelected('INDIVIDUAL')}
            className={`text-left p-8 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
              selected === 'INDIVIDUAL' 
                ? 'border-vintage-olive bg-vintage-beige shadow-md' 
                : 'border-vintage-brown/20 bg-white hover:border-vintage-olive/50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-vintage-brown/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className={`w-6 h-6 ${selected === 'INDIVIDUAL' ? 'text-vintage-olive' : 'text-vintage-brown'}`} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">Personal Productivity</h3>
            <p className="text-sm text-vintage-brown leading-relaxed">
              Focus modes, habit tracking, daily planners, and personal goal management.
            </p>
            {selected === 'INDIVIDUAL' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-vintage-olive rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </button>

          {/* Team Option */}
          <button
            onClick={() => setSelected('TEAM')}
            className={`text-left p-8 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${
              selected === 'TEAM' 
                ? 'border-vintage-olive bg-vintage-beige shadow-md' 
                : 'border-vintage-brown/20 bg-white hover:border-vintage-olive/50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-vintage-brown/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className={`w-6 h-6 ${selected === 'TEAM' ? 'text-vintage-olive' : 'text-vintage-brown'}`} />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">Team Collaboration</h3>
            <p className="text-sm text-vintage-brown leading-relaxed">
              Shared workspaces, task delegation, performance analytics, and progress tracking.
            </p>
            {selected === 'TEAM' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-vintage-olive rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </div>
            )}
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="vintage-btn-primary px-8 py-4 text-lg inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Workspace <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
