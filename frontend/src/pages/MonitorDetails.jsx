import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getMonitorById, getMonitorChecks, runMonitorCheck } from "../api/monitorApi";
import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import CheckHistoryTable from "../components/CheckHistoryTable";
import { formatDate } from "../utils/formatDate";

function MonitorDetails() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const monitorQuery = useQuery({
    queryKey: ["monitor", id],
    queryFn: () => getMonitorById(id),
  });

  const checksQuery = useQuery({
    queryKey: ["monitor-checks", id],
    queryFn: () => getMonitorChecks(id),
  });

  const runCheckMutation = useMutation({
    mutationFn: runMonitorCheck,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitor", id] });
      queryClient.invalidateQueries({ queryKey: ["monitor-checks", id] });
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
      queryClient.invalidateQueries({ queryKey: ["latest-checks"] });
    },
  });

  if (monitorQuery.isLoading || checksQuery.isLoading) {
    return <LoadingState message="Loading monitor details..." />;
  }

  if (monitorQuery.isError || checksQuery.isError) {
    return <ErrorState message={monitorQuery.error?.message || checksQuery.error?.message} />;
  }

  const monitor = monitorQuery.data;
  const checks = checksQuery.data || [];

  return (
    <div>
      <PageHeader
        title={monitor.name}
        subtitle="Monitor details and check history"
        action={
          <Link
            to="/monitors"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Back to Monitors
          </Link>
        }
      />

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Current status</h2>
          <StatusBadge status={monitor.status} />
        </div>
        <div className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
          <p><span className="font-medium">URL:</span> {monitor.url}</p>
          <p><span className="font-medium">Last status code:</span> {monitor.lastStatusCode ?? "-"}</p>
          <p><span className="font-medium">Last response time:</span> {monitor.lastResponseTimeMs ?? "-"} ms</p>
          <p><span className="font-medium">Last checked at:</span> {formatDate(monitor.lastCheckedAt)}</p>
        </div>
        <button
          onClick={() => runCheckMutation.mutate(monitor.id)}
          disabled={runCheckMutation.isPending}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {runCheckMutation.isPending ? "Running..." : "Run check"}
        </button>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-800">Check history</h2>
        {checks.length ? <CheckHistoryTable checks={checks} /> : <EmptyState message="No checks for this monitor yet." />}
      </section>
    </div>
  );
}

export default MonitorDetails;
