const monitorService = require("../services/monitor.service");

const createMonitor = async (req, res) => {
  const monitor = await monitorService.createMonitor(req.validated.body);
  res.status(201).json(monitor);
};

const getMonitors = async (_req, res) => {
  const monitors = await monitorService.listMonitors();
  res.json(monitors);
};

const getMonitorById = async (req, res) => {
  const monitor = await monitorService.getMonitorById(req.validated.params.id);
  res.json(monitor);
};

const updateMonitor = async (req, res) => {
  const monitor = await monitorService.updateMonitor(
    req.validated.params.id,
    req.validated.body
  );
  res.json(monitor);
};

const deleteMonitor = async (req, res) => {
  await monitorService.deleteMonitor(req.validated.params.id);
  res.json({ message: "Monitor deleted successfully" });
};

module.exports = {
  createMonitor,
  getMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
};
