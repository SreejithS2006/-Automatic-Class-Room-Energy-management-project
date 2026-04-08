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
import { db } from "../firebase";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ref, onValue } from "firebase/database";

const SCHEDULE_DATA = [
  { start: "09:00", end: "10:00", subject: "24ECJ404 – Microprocessors and Microcontrollers", type: "class" },
  { start: "10:00", end: "10:05", subject: "Break", type: "break" },
  { start: "10:05", end: "11:05", subject: "24ECP407(B) – Machine Intelligence", type: "class" },
  { start: "11:05", end: "11:10", subject: "Break", type: "break" },
  { start: "11:10", end: "12:10", subject: "24ECP407(B) – Machine Intelligence", type: "class" },
  { start: "12:10", end: "12:15", subject: "Break", type: "break" },
  { start: "12:15", end: "13:00", subject: "Lunch Break", type: "break" },
  { start: "13:00", end: "14:00", subject: "24ECT402 – Signals and Systems", type: "class" },
  { start: "14:00", end: "14:05", subject: "Break", type: "break" },
  { start: "14:05", end: "15:05", subject: "24ECP403 – Analog Circuits", type: "class" },
  { start: "15:05", end: "15:10", subject: "Break", type: "break" },
  { start: "15:10", end: "16:00", subject: "Free / Lab / Extra Session", type: "class" },
];

const ROOM_MAP: Record<string, { name: string; subtitle: string; level: string }> = {
  "402": { name: "Engineering Lab", subtitle: "Room 402", level: "Level 4 • Zone B" },
  "101": { name: "Lecture Hall", subtitle: "Room 101", level: "Level 1 • Zone A" },
  "205": { name: "Conference Room", subtitle: "Room 205", level: "Level 2 • Zone C" },
  "312": { name: "Physics Lab", subtitle: "Room 312", level: "Level 3 • Zone D" },
};

export const Dashboard = () => {
  const [roomData, setRoomData] = useState(ROOM_MAP["402"]);
  const [time, setTime] = useState(new Date());
  const [temperature, setTemperature] = useState<string | number>("--");
  const [humidity, setHumidity] = useState<string | number>("--");
  const [fanSpeed, setFanSpeed] = useState<number>(0);
  const [ldrValue, setLdrValue] = useState<number>(0);
  const [occupancy, setOccupancy] = useState<string>("Loading...");
  const [occupancyCount, setOccupancyCount] = useState<number>(0);
  const [powerLoad, setPowerLoad] = useState<number>(0);
  const [dailyUsage, setDailyUsage] = useState<number>(0);
  const [lastSeen, setLastSeen] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  // Determine current and next session
  const currentMinutes = time.getHours() * 60 + time.getMinutes();

  const currentSession = SCHEDULE_DATA.find(s => {
    const [sH, sM] = s.start.split(':').map(Number);
    const [eH, eM] = s.end.split(':').map(Number);
    const startM = sH * 60 + sM;
    const endM = eH * 60 + eM;
    return currentMinutes >= startM && currentMinutes < endM;
  });

  const nextSession = SCHEDULE_DATA.find(s => {
    const [sH, sM] = s.start.split(':').map(Number);
    const startM = sH * 60 + sM;
    return startM > currentMinutes;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      // Check if ESP32 has been seen in the last 15 seconds
      if (lastSeen > 0) {
        const now = Date.now();
        const secondsSinceLastSeen = (now - lastSeen) / 1000;
        const online = secondsSinceLastSeen < 15;
        setIsOnline(online);
        // Debugging: uncomment to see heartbeat timing in console
        // console.log(`Heartbeat check: ${secondsSinceLastSeen.toFixed(1)}s ago (Online: ${online})`);
      }
    }, 1000);

    // Firebase Realtime Database listener
    const dataRef = ref(db, "classroom");
    const unsubscribe = onValue(dataRef, (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        // console.log("Firebase Data Received:", data);
        if (data.temperature !== undefined) setTemperature(data.temperature);
        if (data.humidity !== undefined) setHumidity(data.humidity);
        if (data.fan_speed !== undefined) setFanSpeed(data.fan_speed);

        // Handle variations in light/brightness keys
        if (data.ldr_value !== undefined) setLdrValue(data.ldr_value);
        else if (data.brightness !== undefined) setLdrValue(data.brightness);

        if (data.occupancy_count !== undefined) setOccupancyCount(data.occupancy_count);
        if (data.power_load !== undefined) setPowerLoad(data.power_load);

        // Handle variations in daily energy keys
        if (data.daily_energy_kWh !== undefined) setDailyUsage(data.daily_energy_kWh);
        else if (data.daily_usage !== undefined) setDailyUsage(data.daily_usage);

        // Use 'last_seen' heartbeat if available
        if (data.last_seen !== undefined) {
          setLastSeen(data.last_seen);
        }
        // Fallback: If 'network' boolean exists and heartbeat is missing/stale
        else if (data.network === true) {
          setIsOnline(true);
        } else if (data.network === false) {
          setIsOnline(false);
        }

        if (data.occupancy === true) {
          setOccupancy("Present");
        } else if (data.occupancy === false) {
          setOccupancy("Empty");
        } else {
          setOccupancy("No Data");
        }
      }
    });

    // Load room data from localStorage
    const savedRoomId = localStorage.getItem("classroom_id");
    if (savedRoomId && ROOM_MAP[savedRoomId]) {
      setRoomData(ROOM_MAP[savedRoomId]);
    }

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, [lastSeen]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl font-bold">{roomData.name}</h1>
          <p className="text-slate-400 text-sm">{roomData.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono font-medium">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className={`${isOnline ? "text-[#22C55E]" : "text-red-500"} text-xs font-medium flex items-center justify-end gap-1 transition-colors duration-500`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-[#22C55E] animate-pulse" : "bg-red-500"}`} />
            {isOnline ? "Connected" : "Offline"}
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
            {roomData.level}
          </span>
        </div>
      </div>

      {/* Class Schedule Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[#1E293B] p-5 rounded-3xl border border-slate-700/50 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 bg-blue-500/10 blur-3xl rounded-full -mr-4 -mt-4" />

        <div className="relative flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-1">Active Session</p>
            <h2 className="text-lg font-bold leading-tight">
              {currentSession ? currentSession.subject : "No Active Class"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {currentSession ? `${currentSession.start} - ${currentSession.end}` : "Next class later"}
            </p>
          </div>
          <div className={`p-2 rounded-xl ${currentSession?.type === 'class' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
            <Activity size={20} />
          </div>
        </div>

        {nextSession && (
          <div className="relative border-t border-slate-700/50 pt-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <p className="text-[10px] text-slate-400 font-medium">NEXT: <span className="text-slate-200">{nextSession.subject}</span></p>
            </div>
            <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{nextSession.start}</p>
          </div>
        )}
      </motion.div>

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
          <div className={`p-2 ${isOnline ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"} rounded-lg transition-colors duration-500`}>
            <Wifi size={18} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase">Network</p>
            <p className={`text-sm font-bold ${isOnline ? "text-white" : "text-red-500"} transition-colors duration-500`}>
              {isOnline ? "Connected" : "Offline"}
            </p>
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
          value={fanSpeed}
          unit="%"
        />

        <MetricCard
          icon={Lightbulb}
          title="Brightness"
          value={ldrValue}
          unit="%"
        />

        <MetricCard
          icon={Droplets}
          title="Humidity"
          value={humidity}
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
