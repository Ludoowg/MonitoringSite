const client = require("@prometheus-io/client");

const Registry = client.Registry;
const register = new Registry();

client.collectDefaultMetrics({ register });

const monitorsByStatus = new client.Gauge({
  name: "monitoring_monitors",
  help: "Number of monitors by status",
  labelNames: ["status"],
  registers: [register],
});

const checksTotal = new client.Counter({
  name: "monitoring_checks_total",
  help: "Total number of executed HTTP checks",
  labelNames: ["result"],
  registers: [register],
});

const checkDuration = new client.Histogram({
  name: "monitoring_check_duration_seconds",
  help: "Duration of executed HTTP checks in seconds",
  labelNames: ["result"],
  buckets: [0.1, 0.25, 0.5, 1, 2, 5, 10],
  registers: [register],
});

const checkErrorsTotal = new client.Counter({
  name: "monitoring_check_errors_total",
  help: "Total number of check errors by category",
  labelNames: ["type"],
  registers: [register],
});

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register],
});

module.exports = {
  register,
  monitorsByStatus,
  checksTotal,
  checkDuration,
  checkErrorsTotal,
  httpRequestsTotal,
  httpRequestDuration,
};
