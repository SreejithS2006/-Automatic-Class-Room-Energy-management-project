import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { Control } from "./pages/Control";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
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
]);
