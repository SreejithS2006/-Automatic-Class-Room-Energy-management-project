import React from "react";
import { 
  Wifi, 
  Database, 
  Download, 
  Info, 
  ShieldCheck, 
  ChevronRight,
  LogOut,
  RefreshCw,
  Server
} from "lucide-react";

export const Settings = () => {
  const sections = [
    {
      title: "Connectivity",
      items: [
        { icon: Wifi, label: "Network Status", value: "Active", color: "text-[#22C55E]" },
        { icon: Server, label: "Cloud Link", value: "Synched", color: "text-[#22C55E]" },
      ]
    },
    {
      title: "Data Management",
      items: [
        { icon: Download, label: "Export Energy Data", value: "CSV/PDF", color: "text-blue-400" },
        { icon: RefreshCw, label: "Reset Daily Cache", color: "text-slate-400" },
      ]
    },
    {
      title: "System Info",
      items: [
        { icon: Info, label: "Device Firmware", value: "v2.4.1", color: "text-slate-400" },
        { icon: ShieldCheck, label: "Hardware Health", value: "Optimal", color: "text-[#22C55E]" },
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-slate-400 text-sm">Hardware & interface configuration</p>
      </header>

      {/* Profile/Device Brief */}
      <div className="bg-[#1E293B] p-5 rounded-3xl border border-slate-700/50 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22C55E] to-blue-500 flex items-center justify-center">
          <Database size={32} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Gateway-ESP32-402</h2>
          <p className="text-xs text-slate-400">MAC: 4A:33:1B:92:0F:CC</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold">ONLINE</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold">SECURED</span>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-2">{section.title}</h3>
            <div className="bg-[#1E293B] rounded-3xl border border-slate-700/50 overflow-hidden">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button 
                    key={i}
                    className={`w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors ${
                      i !== section.items.length - 1 ? 'border-b border-slate-700/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-[#0F172A] ${item.color || 'text-slate-400'}`}>
                        <Icon size={18} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && <span className={`text-xs font-bold ${item.color || 'text-slate-500'}`}>{item.value}</span>}
                      <ChevronRight size={16} className="text-slate-600" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout/Disconnect */}
      <button className="w-full flex items-center justify-center gap-2 text-slate-500 hover:text-rose-500 transition-colors py-4">
        <LogOut size={18} />
        <span className="text-sm font-bold">Disconnect Device</span>
      </button>

      <footer className="text-center pb-8">
        <p className="text-[10px] text-slate-600">Smart Energy Management System</p>
        <p className="text-[10px] text-slate-600 font-medium">Developed for Engineering Laboratory v2.0</p>
      </footer>
    </div>
  );
};
