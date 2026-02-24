import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendColor?: "green" | "red" | "orange" | "blue";
  statusColor?: string;
}

export const MetricCard = ({ 
  icon: Icon, 
  title, 
  value, 
  unit, 
  trend, 
  trendColor = "green",
  statusColor = "text-[#22C55E]"
}: MetricCardProps) => {
  const getTrendClass = () => {
    switch(trendColor) {
      case "red": return "text-rose-500";
      case "orange": return "text-orange-500";
      case "blue": return "text-blue-400";
      default: return "text-[#22C55E]";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-[#1E293B] p-4 rounded-3xl border border-slate-700/50 shadow-lg"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-xl bg-[#0F172A] ${statusColor}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-[#0F172A] ${getTrendClass()}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight">{value}</span>
          {unit && <span className="text-slate-500 text-sm font-medium">{unit}</span>}
        </div>
      </div>
    </motion.div>
  );
};
