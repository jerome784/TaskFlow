import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  Calendar,
  Coffee,
  BookOpen,
  Target,
  User
} from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import { cn } from "../utils/utils";
import CommandPalette from "../components/CommandPalette";
import NotificationBell from "../components/features/NotificationBell";

export default function MainLayout() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user, purpose, logout } = useAuthStore();
  const location = useLocation();

  // Define navigation based on purpose
  const navItems = purpose === 'TEAM' ? [
    { name: "Team Dashboard", path: "/app/team-dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/app/tasks", icon: CheckSquare },
    { name: "Projects", path: "/app/projects", icon: FolderKanban },
    { name: "Reports", path: "/app/reports", icon: BarChart3 },
    { name: "Profile", path: "/app/profile", icon: Settings },
  ] : [
    { name: "My Day", path: "/app/personal-dashboard", icon: LayoutDashboard },
    { name: "Weekly Planner", path: "/app/planner", icon: Calendar },
    { name: "Habits Tracker", path: "/app/habits", icon: Coffee },
    { name: "Journal", path: "/app/journal", icon: BookOpen },
    { name: "Focus Tasks", path: "/app/tasks", icon: Target },
    { name: "Profile", path: "/app/profile", icon: Settings },
  ];

  if (purpose === 'TEAM' && user?.role === "ADMIN") {
    navItems.push({ name: "Admin", path: "/app/admin", icon: Users });
  }

  return (
    <div className="flex h-screen bg-vintage-cream text-vintage-charcoal overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-vintage-beige border-r border-vintage-brown/20 transition-all duration-300 flex flex-col z-20",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-vintage-brown/20">
          {isSidebarOpen && (
            <div className="font-serif font-bold text-xl tracking-tight text-vintage-charcoal truncate flex items-center gap-2">
              <span className="text-vintage-olive">⚲</span> TaskFlow
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-vintage-brown/10 text-vintage-brown"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-vintage-brown/20">
          {isSidebarOpen ? (
             <p className="text-[10px] font-bold uppercase tracking-widest text-vintage-olive">
               {purpose === 'TEAM' ? 'Team Workspace' : 'Personal Workspace'}
             </p>
          ) : (
            <div className="w-full flex justify-center text-vintage-olive">
               {purpose === 'TEAM' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive 
                    ? "bg-vintage-olive text-vintage-cream shadow-sm" 
                    : "text-vintage-charcoal/70 hover:text-vintage-charcoal hover:bg-vintage-brown/10",
                  !isSidebarOpen && "justify-center"
                )}
                title={item.name}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-vintage-cream")} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-vintage-brown/20">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 text-vintage-brown hover:text-vintage-charcoal w-full transition-colors",
              !isSidebarOpen && "justify-center"
            )}
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium text-sm">Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Navbar */}
        <header className="h-16 bg-vintage-cream/80 backdrop-blur-md border-b border-vintage-brown/20 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center text-sm text-vintage-brown">
            <span className="hidden md:inline-block">Press</span>
            <kbd className="hidden md:inline-block mx-2 px-2 py-0.5 bg-vintage-beige rounded border border-vintage-brown/30 text-xs font-mono text-vintage-charcoal">
              ⌘K
            </kbd>
            <span className="hidden md:inline-block">to open command palette</span>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-6 w-px bg-vintage-brown/20 hidden sm:block"></div>
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold font-serif text-vintage-charcoal">{user?.name || "User"}</div>
              <div className="text-xs text-vintage-brown">{user?.role || "Member"}</div>
            </div>
            <div className="w-9 h-9 rounded-full border border-vintage-olive bg-vintage-beige flex items-center justify-center font-bold font-serif text-sm text-vintage-olive">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-transparent relative z-0">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette overlay */}
      <CommandPalette />
    </div>
  );
}
