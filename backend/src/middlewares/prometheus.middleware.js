const {
  httpRequestsTotal,
  httpRequestDuration,
} = require("../../metrics/prometheus_client");

const IGNORED_PATHS = new Set(["/metrics"]);

const getRequestPath = (req) => (req.originalUrl || "").split("?")[0];

const getNormalizedRoute = (req) => {
  const routePath = req.route && req.route.path;

  if (typeof routePath !== "string") {
    return "unmatched";
  }

  if (routePath === "/") {
    return req.baseUrl || "/";
  }

  return `${req.baseUrl || ""}${routePath}`;
};

const prometheusMiddleware = (req, res, next) => {
  if (IGNORED_PATHS.has(getRequestPath(req))) {
    return next();
  }

  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1e9;
    const labels = {
      method: req.method,
      route: getNormalizedRoute(req),
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, durationSeconds);
  });

  next();
};

module.exports = prometheusMiddleware;
