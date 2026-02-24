import React from "react";
import { Outlet, NavLink, useLocation } from "react-router";
import { LayoutDashboard, ChartBar, Settings, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/analytics", icon: ChartBar, label: "Analytics" },
    { path: "/control", icon: SlidersHorizontal, label: "Control" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-white font-sans overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-4"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-slate-700/50 backdrop-blur-lg pb-safe">
        <div className="max-w-md mx-auto px-6 h-20 flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center space-y-1 group"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? "bg-[#22C55E]/10 text-[#22C55E]" 
                    : "text-slate-400 group-hover:text-slate-300"
                }`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-[#22C55E]" : "text-slate-400"
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute -top-1 w-1 h-1 bg-[#22C55E] rounded-full"
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
