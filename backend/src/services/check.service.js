const checkRepository = require("../repositories/check.repository");
const monitorService = require("./monitor.service");
const { runHttpCheck } = require("./httpCheck.service");

const runManualCheck = async (monitorId) => {
  const monitor = await monitorService.getMonitorById(monitorId);
  const result = await runHttpCheck(monitor.url);
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
