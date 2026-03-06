import React, { useState } from "react";
import { motion } from "motion/react";
import {
    Lock,
    Mail,
    ArrowRight,
    Cpu,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    browserLocalPersistence,
    setPersistence
} from "firebase/auth";
import { useNavigate } from "react-router";

// Firebase configuration
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
const auth = getAuth(app);

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Abstract Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="inline-flex p-4 bg-blue-500/10 rounded-3xl border border-blue-500/20 mb-6"
                    >
                        <Cpu size={40} className="text-blue-400" />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Smart Classroom</h1>
                    <p className="text-slate-400">Energy Management System v2.0</p>
                </div>

                {/* Login Form Card */}
                <div className="bg-[#1E293B]/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck size={120} />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">
                                Access Identifier
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@smartedge.io"
                                    className="w-full bg-[#0F172A]/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block ml-1">
                                Security Key
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0F172A]/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium placeholder:text-slate-600"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-rose-500 text-sm font-medium bg-rose-500/10 p-4 rounded-xl border border-rose-500/20"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    INITIALIZE SYSTEM
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <p className="text-center mt-8 text-slate-500 text-xs font-medium uppercase tracking-[0.2em]">
                    Secure Access Terminal • Room 402
                </p>
            </motion.div>
        </div>
    );
};
