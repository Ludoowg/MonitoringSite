import { getStatusClassName, getStatusLabel } from "../utils/formatStatus";

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClassName(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export default StatusBadge;
