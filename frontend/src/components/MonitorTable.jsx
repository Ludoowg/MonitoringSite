import MonitorCard from "./MonitorCard";

function MonitorTable({ monitors, onRunCheck, onDelete, runningCheckId }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {monitors.map((monitor) => (
        <MonitorCard
          key={monitor.id}
          monitor={monitor}
          onRunCheck={onRunCheck}
          onDelete={onDelete}
          runningCheckId={runningCheckId}
        />
      ))}
    </div>
  );
}

export default MonitorTable;
