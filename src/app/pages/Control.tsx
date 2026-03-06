import React, { useState } from "react";
import {
  Power,
  Settings2,
  Wind,
  Lightbulb,
  Clock,
  AlertTriangle,
  Zap,
  Cpu
} from "lucide-react";
import { motion } from "motion/react";

export const Control = () => {
  const [autoMode, setAutoMode] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);
  const [fanSpeed, setFanSpeed] = useState(65);
  const [brightness, setBrightness] = useState(80);
  const toggleAutoMode = () => {
    const nextAuto = !autoMode;
    setAutoMode(nextAuto);
    setManualOverride(!nextAuto);
  };

  const toggleManualOverride = () => {
    const nextManual = !manualOverride;
    setManualOverride(nextManual);
    setAutoMode(!nextManual);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-2xl font-bold">Smart Control</h1>
        <p className="text-slate-400 text-sm">System override & configuration</p>
      </header>

      {/* Main Toggles */}
      <div className="bg-[#1E293B] p-5 rounded-3xl border border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${autoMode ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-slate-800 text-slate-500'}`}>
              <Cpu size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Auto Smart Mode</p>
              <p className="text-xs text-slate-400">AI occupancy management</p>
            </div>
          </div>
          <button
            onClick={toggleAutoMode}
            className={`w-12 h-6 rounded-full transition-colors relative ${autoMode ? 'bg-[#22C55E]' : 'bg-slate-700'}`}
          >
            <motion.div
              animate={{ x: autoMode ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>

        <div className="border-t border-slate-700/50 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${manualOverride ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-800 text-slate-500'}`}>
              <Settings2 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Manual Override</p>
              <p className="text-xs text-slate-400">Disable occupancy sensor</p>
            </div>
          </div>
          <button
            onClick={toggleManualOverride}
            className={`w-12 h-6 rounded-full transition-colors relative ${manualOverride ? 'bg-orange-500' : 'bg-slate-700'}`}
          >
            <motion.div
              animate={{ x: manualOverride ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                <Wind size={20} />
              </div>
              <h3 className="text-sm font-bold">Fan Speed</h3>
            </div>
            <span className="text-lg font-bold font-mono text-blue-400">{fanSpeed}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={fanSpeed}
            onChange={(e) => setFanSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-[#0F172A] rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
            disabled={autoMode && !manualOverride}
          />
          <div className="flex justify-between mt-2 text-[10px] font-medium text-slate-500 uppercase tracking-widest">
            <span>Off</span>
            <span>Max</span>
          </div>
        </div>

        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700/50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${brightness > 0 ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-800 text-slate-500'}`}>
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Light</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{brightness > 0 ? 'On' : 'Off'}</p>
              </div>
            </div>
            <button
              onClick={() => setBrightness(brightness === 0 ? 100 : 0)}
              className={`w-12 h-6 rounded-full transition-colors relative ${brightness > 0 ? 'bg-yellow-500' : 'bg-slate-700'}`}
              disabled={autoMode && !manualOverride}
            >
              <motion.div
                animate={{ x: brightness > 0 ? 24 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Control Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-[#1E293B] p-4 rounded-3xl border border-slate-700/50 flex flex-col items-center gap-3 active:scale-95 transition-transform">
          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
            <Clock size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Delay Timer</span>
        </button>
        <button className="bg-[#1E293B] p-4 rounded-3xl border border-slate-700/50 flex flex-col items-center gap-3 active:scale-95 transition-transform">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <Zap size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Load Threshold</span>
        </button>
      </div>

      {/* Emergency Button */}
      <button className="w-full bg-rose-500/10 border border-rose-500/20 py-4 rounded-2xl flex items-center justify-center gap-3 active:bg-rose-500 active:text-white transition-all group">
        <AlertTriangle size={20} className="text-rose-500 group-active:text-white" />
        <span className="font-bold text-rose-500 group-active:text-white">EMERGENCY SYSTEM OFF</span>
      </button>
    </div>
  );
};
