const checkRepository = require("../repositories/check.repository");
const monitorService = require("./monitor.service");
const { runHttpCheck } = require("./httpCheck.service");
const {
  checksTotal,
  checkDuration,
  checkErrorsTotal,
} = require("../../metrics/prometheus_client");

const CHECK_RESULTS = new Set(["UP", "DOWN", "SLOW", "UNKNOWN"]);

const normalizeCheckResult = (status) =>
  CHECK_RESULTS.has(status) ? status : "UNKNOWN";

const classifyCheckError = ({ statusCode, errorMessage }) => {
  if (statusCode >= 400 && statusCode <= 499) {
    return "http_4xx";
  }

  if (statusCode >= 500) {
    return "http_5xx";
  }

  const message = String(errorMessage || "").toLowerCase();
  if (!message) {
    return null;
  }

  if (
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("etimedout") ||
    message.includes("econnaborted")
  ) {
    return "timeout";
  }

  if (
    message.includes("enotfound") ||
    message.includes("eai_again") ||
    message.includes("getaddrinfo") ||
    message.includes("dns")
  ) {
    return "dns";
  }

  if (
    message.includes("econnrefused") ||
    message.includes("econnreset") ||
    message.includes("ehostunreach") ||
    message.includes("enetunreach") ||
    message.includes("network")
  ) {
    return "network";
  }

  return "unknown";
};

const recordCheckMetrics = (result) => {
  const checkResult = normalizeCheckResult(result.status);

  checksTotal.inc({ result: checkResult });
  checkDuration.observe(
    { result: checkResult },
    (result.responseTimeMs || 0) / 1000
  );

  const errorType = classifyCheckError(result);
  if (errorType) {
    checkErrorsTotal.inc({ type: errorType });
  }
};

const runManualCheck = async (monitorId) => {
  const monitor = await monitorService.getMonitorById(monitorId);
  const result = await runHttpCheck(monitor.url);
  recordCheckMetrics(result);
  const checkedAt = new Date();

  const check = await checkRepository.create({
    monitorId: monitor.id,
    status: result.status,
    statusCode: result.statusCode,
    responseTimeMs: result.responseTimeMs,
    errorMessage: result.errorMessage,
    checkedAt,
  });

  const updatedMonitor = await monitorService.updateMonitorStatus(monitor.id, {
    status: result.status,
    lastStatusCode: result.statusCode,
    lastResponseTimeMs: result.responseTimeMs,
    lastCheckedAt: checkedAt,
  });

  return {
    monitor: updatedMonitor,
    check,
  };
};

const listMonitorChecks = async (monitorId) => {
  await monitorService.getMonitorById(monitorId);
  return checkRepository.findByMonitorId(monitorId);
};

const listLatestChecks = async () => checkRepository.findLatest();

module.exports = {
  runManualCheck,
  listMonitorChecks,
  listLatestChecks,
};
