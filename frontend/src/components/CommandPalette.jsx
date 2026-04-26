import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { LayoutDashboard, CheckSquare, FolderKanban, BarChart3, Settings, Moon, Sun } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import "../index.css"; // Ensure cmdk styles if any

export default function CommandPalette() {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, setCommandPaletteOpen, isDarkTheme, toggleTheme } = useUIStore();

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
        <Command label="Command Palette" className="flex flex-col w-full h-full text-slate-100">
          <div className="flex items-center border-b border-slate-800 px-3">
            <Command.Input 
              autoFocus 
              placeholder="Type a command or search..." 
              className="w-full bg-transparent p-4 outline-none placeholder:text-slate-500"
            />
          </div>
          
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="p-4 text-center text-sm text-slate-400">
              No results found.
            </Command.Empty>

            <Command.Group heading="Pages" className="text-xs font-medium text-slate-500 p-2">
              <Command.Item onSelect={() => runCommand(() => navigate("/app/dashboard"))} className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm text-slate-200">
                <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate("/app/tasks"))} className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm text-slate-200">
                <CheckSquare className="w-4 h-4 text-slate-400" /> Tasks
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate("/app/projects"))} className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm text-slate-200">
                <FolderKanban className="w-4 h-4 text-slate-400" /> Projects
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate("/app/reports"))} className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm text-slate-200">
                <BarChart3 className="w-4 h-4 text-slate-400" /> Reports
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Settings" className="text-xs font-medium text-slate-500 p-2 border-t border-slate-800/50 mt-2">
              <Command.Item onSelect={() => runCommand(() => navigate("/app/profile"))} className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm text-slate-200">
                <Settings className="w-4 h-4 text-slate-400" /> Profile Settings
              </Command.Item>
              <Command.Item onSelect={() => runCommand(toggleTheme)} className="flex items-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-800 cursor-pointer text-sm text-slate-200">
                {isDarkTheme ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-400" />} 
                Toggle Theme
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
