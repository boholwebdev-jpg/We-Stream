import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Radio, Settings, LogOut, User, Menu, X } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Streams", path: "/streams", icon: Radio },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar / Desktop Nav */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-[#141414] bg-[#E4E3E0] hidden md:flex flex-col">
        <div className="p-8 border-bottom border-[#141414]">
          <h1 className="font-serif italic text-2xl tracking-tight">WE STREAM</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Admin Control Panel</p>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 border border-transparent transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-[#141414] text-[#E4E3E0] border-[#141414]" 
                  : "hover:border-[#141414] hover:bg-[#141414]/5"
              )}
            >
              <item.icon size={18} />
              <span className="font-mono text-sm tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#141414]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 border border-transparent hover:border-[#141414] hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="font-mono text-sm tracking-tight">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen">
        <header className="h-16 border-b border-[#141414] flex items-center justify-between px-8 bg-[#E4E3E0]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <span className="font-serif italic text-xs opacity-50 uppercase tracking-widest">
              {navItems.find(i => i.path === location.pathname)?.name || "Control"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 border border-[#141414] rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-tighter">System Online</span>
            </div>
            <User size={20} className="opacity-50" />
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#E4E3E0] md:hidden">
          <div className="p-8 flex justify-between items-center border-b border-[#141414]">
            <h1 className="font-serif italic text-2xl tracking-tight">WE STREAM</h1>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="p-8 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-2xl font-serif italic"
              >
                <item.icon size={24} />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 text-2xl font-serif italic text-red-600 pt-8"
            >
              <LogOut size={24} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
