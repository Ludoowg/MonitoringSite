import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "../pages/Dashboard";
import Monitors from "../pages/Monitors";
import MonitorDetails from "../pages/MonitorDetails";
import Checks from "../pages/Checks";
import NotFound from "../pages/NotFound";

function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitors" element={<Monitors />} />
        <Route path="/monitors/:id" element={<MonitorDetails />} />
        <Route path="/checks" element={<Checks />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default AppRouter;
