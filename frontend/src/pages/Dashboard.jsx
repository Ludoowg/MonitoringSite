import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMonitors } from "../api/monitorApi";
import { getLatestChecks } from "../api/checkApi";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import RecentChecksTable from "../components/RecentChecksTable";
import MonitorTable from "../components/MonitorTable";

function Dashboard() {
  const monitorsQuery = useQuery({ queryKey: ["monitors"], queryFn: getMonitors });
  const checksQuery = useQuery({ queryKey: ["latest-checks"], queryFn: getLatestChecks });

  if (monitorsQuery.isLoading || checksQuery.isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (monitorsQuery.isError || checksQuery.isError) {
    return (
      <ErrorState
        message={monitorsQuery.error?.message || checksQuery.error?.message}
      />
    );
  }

  const monitors = monitorsQuery.data || [];
  const checks = checksQuery.data || [];

  const stats = {
    total: monitors.length,
    up: monitors.filter((m) => m.status === "UP").length,
    down: monitors.filter((m) => m.status === "DOWN").length,
    slow: monitors.filter((m) => m.status === "SLOW").length,
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of monitors and latest checks"
        action={
          <Link
            to="/monitors"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Go to Monitors
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total monitors" value={stats.total} />
        <StatCard label="UP" value={stats.up} />
        <StatCard label="DOWN" value={stats.down} />
        <StatCard label="SLOW" value={stats.slow} />
      </div>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Recent checks</h2>
        {checks.length ? <RecentChecksTable checks={checks.slice(0, 8)} /> : <EmptyState message="No checks yet." />}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Monitors overview</h2>
        {monitors.length ? (
          <MonitorTable monitors={monitors.slice(0, 6)} onRunCheck={() => {}} onDelete={() => {}} runningCheckId={null} />
        ) : (
          <EmptyState message="No monitors yet." />
        )}
      </section>
    </div>
  );
}

export default Dashboard;
