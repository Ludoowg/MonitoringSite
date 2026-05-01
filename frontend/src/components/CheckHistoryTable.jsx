import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/formatDate";

function CheckHistoryTable({ checks }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Status code</th>
            <th className="px-4 py-3">Response time</th>
            <th className="px-4 py-3">Error</th>
            <th className="px-4 py-3">Checked at</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={check.id} className="border-t border-slate-100">
              <td className="px-4 py-3"><StatusBadge status={check.status} /></td>
              <td className="px-4 py-3">{check.statusCode ?? "-"}</td>
              <td className="px-4 py-3">{check.responseTimeMs ?? "-"} ms</td>
              <td className="max-w-[240px] truncate px-4 py-3 text-rose-600">{check.errorMessage || "-"}</td>
              <td className="px-4 py-3">{formatDate(check.checkedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CheckHistoryTable;
