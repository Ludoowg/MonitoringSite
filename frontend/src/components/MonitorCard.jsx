import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/formatDate";

function MonitorCard({ monitor, onRunCheck, onDelete, runningCheckId }) {
  const isRunning = runningCheckId === monitor.id;

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{monitor.name}</h3>
        <StatusBadge status={monitor.status} />
      </div>
      <p className="mt-1 truncate text-sm text-slate-500">{monitor.url}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <p>Status code: {monitor.lastStatusCode ?? "-"}</p>
        <p>Response: {monitor.lastResponseTimeMs ?? "-"} ms</p>
        <p className="col-span-2">Last check: {formatDate(monitor.lastCheckedAt)}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onRunCheck(monitor.id)}
          disabled={isRunning}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isRunning ? "Running..." : "Run check"}
        </button>
        <Link
          to={`/monitors/${monitor.id}`}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
        >
          Details
        </Link>
        <button
          onClick={() => onDelete(monitor.id)}
          className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default MonitorCard;
