import React, { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { Control } from "./pages/Control";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";

import { auth } from "./firebase";

const ProtectedRoute = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const hasLocalSession = !!localStorage.getItem("classroom_id") &&
    !!localStorage.getItem("auth_timestamp");

  if (loading && !hasLocalSession) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center" >
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (user || hasLocalSession) ? <Outlet /> : <Navigate to="/login" replace />;
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
