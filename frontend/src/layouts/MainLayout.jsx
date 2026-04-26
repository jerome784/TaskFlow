import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { useAuthStore } from "../store/authStore";
import { cn } from "../utils/utils";
import CommandPalette from "../components/CommandPalette";

export default function MainLayout() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/app/dashboard", icon: LayoutDashboard },
    { name: "Tasks", path: "/app/tasks", icon: CheckSquare },
    { name: "Projects", path: "/app/projects", icon: FolderKanban },
    { name: "Reports", path: "/app/reports", icon: BarChart3 },
    { name: "Profile", path: "/app/profile", icon: Settings },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ name: "Admin", path: "/app/admin", icon: Users });
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-950 border-r border-slate-800 transition-all duration-300 flex flex-col",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {isSidebarOpen && (
            <div className="font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 truncate">
              TaskFlow
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400"
          >
            <Menu className="w-5 h-5" />
          </button>
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
                    ? "bg-blue-500/10 text-blue-400 font-medium" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                  !isSidebarOpen && "justify-center"
                )}
                title={item.name}
              >
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-500")} />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className={cn(
              "flex items-center gap-3 text-red-400 hover:text-red-300 w-full transition-colors",
              !isSidebarOpen && "justify-center"
            )}
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Log out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Navbar */}
        <header className="h-16 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center text-sm text-slate-400">
            <span className="hidden md:inline-block">Press</span>
            <kbd className="hidden md:inline-block mx-2 px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-slate-300">
              ⌘K
            </kbd>
            <span className="hidden md:inline-block">to open command palette</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-slate-200">{user?.name || "User"}</div>
              <div className="text-xs text-emerald-400">{user?.role || "USER"}</div>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-900">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette overlay */}
      <CommandPalette />
    </div>
  );
}
