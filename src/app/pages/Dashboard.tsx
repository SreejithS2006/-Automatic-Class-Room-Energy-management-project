import React, { useState, useEffect } from "react";
import {
  Users,
  Zap,
  Lightbulb,
  Wind,
  Thermometer,
  Droplets,
  Cloud,
  Wifi,
  Activity
} from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { motion } from "motion/react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// Firebase configuration from user
const firebaseConfig = {
  apiKey: "AIzaSyCfZuHB13YusjkMBnbpq0rZ32_2c_thkto",
  authDomain: "auto-classroom-energy-manager.firebaseapp.com",
  databaseURL: "https://auto-classroom-energy-manager-default-rtdb.firebaseio.com",
  projectId: "auto-classroom-energy-manager",
  storageBucket: "auto-classroom-energy-manager.firebasestorage.app",
  messagingSenderId: "658818233323",
  appId: "1:658818233323:web:5c19d4aa5871575221dfae",
  measurementId: "G-9H9ZZLLJZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const Dashboard = () => {
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState<string | number>("--");
  const [occupancy, setOccupancy] = useState<string>("Loading...");
  const [occupancyCount, setOccupancyCount] = useState<number>(0);
  const [powerLoad, setPowerLoad] = useState<number>(0);
  const [dailyUsage, setDailyUsage] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);

    // Firebase Realtime Database listener
    const dataRef = ref(db, "classroom");
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.temperature !== undefined) setTemperature(data.temperature);
        if (data.occupancy_count !== undefined) setOccupancyCount(data.occupancy_count);
        if (data.power_load !== undefined) setPowerLoad(data.power_load);
        if (data.daily_usage !== undefined) setDailyUsage(data.daily_usage);

        if (data.occupancy === true) {
          setOccupancy("Present");
        } else if (data.occupancy === false) {
          setOccupancy("Empty");
        } else {
          setOccupancy("No Data");
        }
      }
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl font-bold">Smart Classroom</h1>
          <p className="text-slate-400 text-sm">Engineering Lab • Room 402</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono font-medium">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-[#22C55E] text-xs font-medium flex items-center justify-end gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            Live Sync
          </p>
        </div>
      </div>

      {/* Hero Room Image */}
      <div className="relative h-40 rounded-3xl overflow-hidden border border-slate-700/50">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2llbmNlJTIwbGFib3JhdG9yeSUyMGludGVyaW9yJTIwZW5naW5lZXJpbmd8ZW58MXx8fHwxNzcxNTE5Mzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Engineering Lab"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold border border-white/10 uppercase tracking-widest">
            Level 4 • Zone B
          </span>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#1E293B] p-3 rounded-2xl flex items-center gap-3 border border-slate-700/50">
          <div className="p-2 bg-[#22C55E]/10 rounded-lg text-[#22C55E]">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase">Mode</p>
            <p className="text-sm font-bold text-[#22C55E]">Auto AI</p>
          </div>
        </div>
        <div className="bg-[#1E293B] p-3 rounded-2xl flex items-center gap-3 border border-slate-700/50">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
            <Wifi size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase">Network</p>
            <p className="text-sm font-bold">Connected</p>
          </div>
        </div>
      </div>

      {/* Main Monitoring Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <MetricCard
            icon={Users}
            title="Current Occupancy"
            value={occupancyCount}
            unit="People"
            trend={occupancy}
            trendColor={occupancy === "Present" ? "blue" : "red"}
          />
        </div>

        <MetricCard
          icon={Thermometer}
          title="Temperature"
          value={temperature}
          unit="°C"
          statusColor="text-blue-400"
        />

        <MetricCard
          icon={Zap}
          title="Power Load"
          value={powerLoad.toFixed(0)}
          unit="W"
          trend={powerLoad > 50 ? "High" : "Low"}
          trendColor={powerLoad > 50 ? "orange" : "green"}
          statusColor={powerLoad > 50 ? "text-orange-500" : "text-green-500"}
        />

        <MetricCard
          icon={Cloud}
          title="Daily Usage"
          value={dailyUsage.toFixed(4)}
          unit="kWh"
          trend="+0.001"
          trendColor="green"
        />

        <MetricCard
          icon={Wind}
          title="Fan Speed"
          value="65"
          unit="%"
        />

        <MetricCard
          icon={Lightbulb}
          title="Brightness"
          value="80"
          unit="%"
        />

        <MetricCard
          icon={Droplets}
          title="Humidity"
          value="45"
          unit="%"
          statusColor="text-blue-400"
        />
      </div>

      {/* Quick Alerts/Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex gap-3"
      >
        <div className="text-orange-500">
          <Activity size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-orange-500">Peak Load Detected</h4>
          <p className="text-xs text-orange-200/70">Energy consumption is 15% above target. Fan speed auto-reduced to 60%.</p>
        </div>
      </motion.div>
    </div>
  );
};
