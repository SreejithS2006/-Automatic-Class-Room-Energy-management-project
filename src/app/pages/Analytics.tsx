import React from "react";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Leaf, TrendingDown, Clock, Zap } from "lucide-react";
import { motion } from "motion/react";

const lineData = [
  { time: "8a", energy: 1.2 },
  { time: "10a", energy: 3.5 },
  { time: "12p", energy: 4.8 },
  { time: "2p", energy: 4.2 },
  { time: "4p", energy: 3.1 },
  { time: "6p", energy: 1.5 },
  { time: "8p", energy: 0.8 },
];

const barData = [
  { day: "M", usage: 12 },
  { day: "T", usage: 15 },
  { day: "W", usage: 11 },
  { day: "T", usage: 14 },
  { day: "F", usage: 18 },
  { day: "S", usage: 5 },
  { day: "S", usage: 4 },
];

export const Analytics = () => {
  return (
    <div className="space-y-6 max-w-md mx-auto">
      <header>
        <h1 className="text-2xl font-bold">Energy Intelligence</h1>
        <p className="text-slate-400 text-sm">Last updated: 5 mins ago</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1E293B] p-4 rounded-3xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2 text-[#22C55E]">
            <Leaf size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Eco Score</span>
          </div>
          <div className="text-2xl font-bold">92<span className="text-sm font-medium text-slate-500 ml-1">/100</span></div>
          <p className="text-[10px] text-slate-400 mt-1">+4.2% from last week</p>
        </div>
        <div className="bg-[#1E293B] p-4 rounded-3xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Zap size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Saved</span>
          </div>
          <div className="text-2xl font-bold">14.5<span className="text-sm font-medium text-slate-500 ml-1">kWh</span></div>
          <p className="text-[10px] text-slate-400 mt-1">Managed AI savings</p>
        </div>
      </div>

      {/* Hourly Trend Chart */}
      <div className="bg-[#1E293B] p-5 rounded-3xl border border-slate-700/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold">Daily Power Profile</h3>
          <select className="bg-[#0F172A] text-xs font-medium border-none rounded-lg px-2 py-1 outline-none">
            <option>Today</option>
            <option>Yesterday</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px' }}
                itemStyle={{ color: '#22C55E', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="energy" 
                stroke="#22C55E" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorEnergy)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="bg-[#1E293B] p-5 rounded-3xl border border-slate-700/50">
        <h3 className="text-sm font-bold mb-6">Weekly Consumption</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <Tooltip 
                cursor={{fill: '#0F172A'}}
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '12px' }}
              />
              <Bar dataKey="usage" radius={[4, 4, 4, 4]}>
                {barData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.usage > 15 ? '#F97316' : '#22C55E'} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sustainability Metrics */}
      <div className="space-y-3">
        <div className="bg-[#1E293B] p-4 rounded-2xl flex items-center justify-between border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#22C55E]/10 rounded-xl text-[#22C55E]">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">CO₂ Saved</p>
              <p className="text-xs text-slate-400">Equivalent to 4 trees planted</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">8.4<span className="text-xs text-slate-500 ml-1">kg</span></p>
          </div>
        </div>
        
        <div className="bg-[#1E293B] p-4 rounded-2xl flex items-center justify-between border border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">Peak Time</p>
              <p className="text-xs text-slate-400">Highest usage at 2:15 PM</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-orange-500">4.8<span className="text-xs text-slate-500 ml-1">kW</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
