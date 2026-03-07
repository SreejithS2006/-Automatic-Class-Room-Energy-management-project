import React, { useState } from "react";
import { motion } from "motion/react";
import {
    Cpu,
    ShieldCheck,
    AlertCircle,
    DoorOpen,
    ChevronDown,
    ArrowRight,
    Hash
} from "lucide-react";
import { useNavigate } from "react-router";
import { getAuth, signInAnonymously } from "firebase/auth";

export const Login = () => {
    const [room, setRoom] = useState("");
    const [pin, setPin] = useState(["", "", "", ""]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    const handlePinChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Auto-focus next
        if (value && index < 3) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !pin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            prevInput?.focus();
        }
    };

    const isReady = room !== "" && pin.every(digit => digit !== "");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const fullPin = pin.join("");

        try {
            if (fullPin === "1234") {
                // For simulation/exhibition purposes, we use Anonymous Auth
                // and store the selected room in localStorage
                await signInAnonymously(auth);
                localStorage.setItem("classroom_id", room);
                localStorage.setItem("auth_timestamp", Date.now().toString());
                navigate("/");
            } else {
                setError(`Authentication failed. Incorrect PIN for Room ${room}`);
                setLoading(false);
                setPin(["", "", "", ""]);
                document.getElementById("pin-0")?.focus();
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during authentication.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060B18] text-white flex items-center justify-center p-6 relative overflow-hidden font-inter">
            {/* Abstract Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-500/10 blur-[140px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-emerald-500/10 blur-[140px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[420px]"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex p-4.5 bg-blue-500/5 border border-blue-500/15 rounded-[24px] mb-6 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <Cpu size={44} className="text-blue-500" />
                    </div>
                    <h1 className="text-[32px] font-bold tracking-[-0.03em] mb-2 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                        Smart Classroom
                    </h1>
                    <p className="text-slate-400 text-sm font-medium tracking-[0.01em]">
                        Energy Management System v2.0
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0F172A]/60 backdrop-blur-[24px] p-10 rounded-[36px] border border-slate-800/40 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden">
                    <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] pointer-events-none">
                        <ShieldCheck size={160} />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8 relative">
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748b] mb-3.5 block ml-1">
                                Select Classroom
                            </label>
                            <div className="relative group">
                                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#475569] group-focus-within:text-blue-500 transition-colors z-10 pointer-events-none">
                                    <DoorOpen size={22} />
                                </div>
                                <select
                                    value={room}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRoom(e.target.value)}
                                    className="w-full bg-[#060B18]/80 border border-[#1e293b] rounded-[18px] py-[18px] pl-[52px] pr-[48px] outline-none text-[15px] font-medium appearance-none transition-all focus:border-blue-500/60 focus:bg-[#0F172A]/90 focus:ring-1 focus:ring-blue-500/30"
                                    required
                                >
                                    <option value="" disabled>Select Room...</option>
                                    <option value="402">Engineering Lab • Room 402</option>
                                    <option value="101">Lecture Hall • Room 101</option>
                                    <option value="205">Conference Room • Room 205</option>
                                    <option value="312">Physics Lab • Room 312</option>
                                </select>
                                <div className="absolute right-[18px] top-1/2 -translate-y-1/2 text-[#475569] pointer-events-none">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748b] mb-3.5 block ml-1 text-center">
                                Secure 4-Digit PIN
                            </label>
                            <div className="flex justify-center gap-[14px]">
                                {pin.map((digit: string, i: number) => (
                                    <input
                                        key={i}
                                        id={`pin-${i}`}
                                        type="password"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePinChange(i, e.target.value)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(i, e)}
                                        className="w-[60px] h-[72px] bg-[#060B18]/80 border border-[#1e293b] rounded-[18px] text-center text-[28px] font-semibold outline-none transition-all focus:border-blue-500 focus:bg-[#0F172A]/90 focus:ring-[4px] focus:ring-blue-500/15"
                                        inputMode="numeric"
                                        required
                                    />
                                ))}
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2.5 text-[#fb7185] bg-[#f43f5e]/10 p-4 border border-[#f43f5e]/15 rounded-[18px] text-sm font-medium"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={!isReady || loading}
                            className="w-full bg-gradient-to-br from-[#2563eb] to-[#3b82f6] text-white font-bold py-[18px] rounded-[20px] shadow-[0_12px_24px_-6px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2.5 transition-all hover:translate-y-[-2px] hover:shadow-[0_16px_32px_-8px_rgba(37,99,235,0.5)] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>ACCESS TERMINAL</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-10 text-center space-y-3">
                    <div className="flex items-center justify-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#475569]">
                        <Hash size={14} />
                        Encrypted Session • Protocol V2
                    </div>
                    <div className="text-blue-500 font-bold text-xs tracking-[0.1em] opacity-80">
                        SmartEdge Solution
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
