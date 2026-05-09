import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { LayoutDashboard, CheckSquare, FolderKanban, Settings, Moon, Sun, Calendar, Coffee, BookOpen } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";

export default function CommandPalette() {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, setCommandPaletteOpen, isDarkTheme, toggleTheme } = useUIStore();
  const { purpose } = useAuthStore();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandPaletteOpen]);

  const runCommand = (command) => {
    setCommandPaletteOpen(false);
    command();
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-vintage-charcoal/40 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-vintage-cream border border-vintage-brown/30 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 relative">
        <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>

        <Command label="Command Palette" className="flex flex-col w-full h-full text-vintage-charcoal relative z-10">
          <div className="flex items-center border-b border-vintage-brown/20 px-3">
            <span className="text-vintage-olive font-serif text-xl pl-2">⚲</span>
            <Command.Input 
              autoFocus 
              placeholder="Search or jump to..." 
              className="w-full bg-transparent p-4 outline-none placeholder:text-vintage-brown font-serif text-lg"
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="p-4 text-center text-sm text-vintage-brown italic font-serif">
              No results found.
            </Command.Empty>

            <Command.Group heading="Pages" className="text-[10px] font-bold uppercase tracking-widest text-vintage-brown/70 p-2">
              {purpose === 'TEAM' ? (
                <>
                  <Command.Item onSelect={() => runCommand(() => navigate("/app/team-dashboard"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-vintage-olive" /> Team Dashboard
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate("/app/tasks"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                    <CheckSquare className="w-4 h-4 text-vintage-olive" /> Tasks
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate("/app/projects"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                    <FolderKanban className="w-4 h-4 text-vintage-olive" /> Projects
                  </Command.Item>
                </>
              ) : (
                <>
                  <Command.Item onSelect={() => runCommand(() => navigate("/app/personal-dashboard"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-vintage-olive" /> Personal Dashboard
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate("/app/planner"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                    <Calendar className="w-4 h-4 text-vintage-olive" /> Weekly Planner
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate("/app/habits"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                    <Coffee className="w-4 h-4 text-vintage-olive" /> Habit Tracker
                  </Command.Item>
                  <Command.Item onSelect={() => runCommand(() => navigate("/app/journal"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                    <BookOpen className="w-4 h-4 text-vintage-olive" /> Journal
                  </Command.Item>
                </>
              )}
            </Command.Group>

            <Command.Group heading="Settings" className="text-[10px] font-bold uppercase tracking-widest text-vintage-brown/70 p-2 border-t border-vintage-brown/10 mt-2">
              <Command.Item onSelect={() => runCommand(() => navigate("/app/profile"))} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                <Settings className="w-4 h-4 text-vintage-brown" /> Profile Settings
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => { toggleTheme(); document.documentElement.classList.toggle('dark'); })} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-vintage-beige cursor-pointer text-sm font-medium transition-colors">
                {isDarkTheme ? <Sun className="w-4 h-4 text-vintage-brown" /> : <Moon className="w-4 h-4 text-vintage-brown" />} 
                Toggle Vintage Theme
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
      
      {/* Overlay to close when clicking outside */}
      <div className="fixed inset-0 -z-10" onClick={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
