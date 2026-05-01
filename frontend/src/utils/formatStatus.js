const statusMap = {
  UP: "UP",
  DOWN: "DOWN",
  SLOW: "SLOW",
  UNKNOWN: "UNKNOWN",
};

const classMap = {
  UP: "bg-emerald-100 text-emerald-700",
  DOWN: "bg-rose-100 text-rose-700",
  SLOW: "bg-amber-100 text-amber-700",
  UNKNOWN: "bg-slate-200 text-slate-700",
};

export const getStatusLabel = (status) => statusMap[status] || "UNKNOWN";

export const getStatusClassName = (status) =>
  classMap[status] || classMap.UNKNOWN;
