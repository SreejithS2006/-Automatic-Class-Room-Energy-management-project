import React, { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { Control } from "./pages/Control";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";

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

const ProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for classroom session in localStorage
    const roomId = localStorage.getItem("classroom_id");
    const authTime = localStorage.getItem("auth_timestamp");

    if (roomId && authTime) {
      // Simple check: session valid if less than 24 hours old
      const isValid = (Date.now() - parseInt(authTime)) < 24 * 60 * 60 * 1000;
      setIsAuthorized(isValid);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: "analytics",
            Component: Analytics,
          },
          {
            path: "control",
            Component: Control,
          },
          {
            path: "settings",
            Component: Settings,
          },
        ],
      },
    ],
  },
]);
