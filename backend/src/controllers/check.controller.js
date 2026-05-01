const checkService = require("../services/check.service");

const runMonitorCheck = async (req, res) => {
  const result = await checkService.runManualCheck(req.validated.params.id);
  res.json(result);
};

const getMonitorChecks = async (req, res) => {
  const checks = await checkService.listMonitorChecks(req.validated.params.id);
  res.json(checks);
};

const getChecks = async (_req, res) => {
  const checks = await checkService.listLatestChecks();
  res.json(checks);
};

module.exports = {
  runMonitorCheck,
  getMonitorChecks,
  getChecks,
};
