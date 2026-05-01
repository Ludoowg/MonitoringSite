import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMonitor,
  deleteMonitor,
  getMonitors,
  runMonitorCheck,
} from "../api/monitorApi";
import PageHeader from "../components/PageHeader";
import AddMonitorForm from "../components/AddMonitorForm";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import MonitorTable from "../components/MonitorTable";

function Monitors() {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState("");
  const [runningCheckId, setRunningCheckId] = useState(null);

  const monitorsQuery = useQuery({ queryKey: ["monitors"], queryFn: getMonitors });

  const createMutation = useMutation({
    mutationFn: createMonitor,
    onSuccess: () => {
      setNotice("Monitor added successfully.");
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
    onError: (error) => setNotice(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMonitor,
    onSuccess: () => {
      setNotice("Monitor deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
      queryClient.invalidateQueries({ queryKey: ["latest-checks"] });
    },
    onError: (error) => setNotice(error.message),
  });

  const runCheckMutation = useMutation({
    mutationFn: runMonitorCheck,
    onMutate: (id) => setRunningCheckId(id),
    onSuccess: () => {
      setNotice("Check completed.");
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
      queryClient.invalidateQueries({ queryKey: ["latest-checks"] });
    },
    onError: (error) => setNotice(error.message),
    onSettled: () => setRunningCheckId(null),
  });

  if (monitorsQuery.isLoading) return <LoadingState message="Loading monitors..." />;
  if (monitorsQuery.isError) return <ErrorState message={monitorsQuery.error.message} />;

  const monitors = monitorsQuery.data || [];

  return (
    <div>
      <PageHeader title="Monitors" subtitle="Create and manage your monitored endpoints" />

      {notice ? (
        <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
          {notice}
        </div>
      ) : null}

      <div className="mb-6">
        <AddMonitorForm
          onSubmit={(payload) => createMutation.mutateAsync(payload)}
          isLoading={createMutation.isPending}
        />
      </div>

      {monitors.length ? (
        <MonitorTable
          monitors={monitors}
          runningCheckId={runningCheckId}
          onRunCheck={(id) => runCheckMutation.mutate(id)}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      ) : (
        <EmptyState message="No monitors created yet." />
      )}
    </div>
  );
}

export default Monitors;
