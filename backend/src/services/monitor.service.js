const monitorRepository = require("../repositories/monitor.repository");
const ApiError = require("../utils/ApiError");
const { MONITOR_STATUS } = require("../utils/status");

const createMonitor = async (payload) =>
  monitorRepository.create({
    ...payload,
    status: MONITOR_STATUS.UNKNOWN,
  });

const listMonitors = async () => monitorRepository.findAll();

const getMonitorById = async (id) => {
  const monitor = await monitorRepository.findById(id);
  if (!monitor) {
    throw new ApiError(404, "Monitor not found");
  }
  return monitor;
};

const updateMonitor = async (id, payload) => {
  await getMonitorById(id);
  return monitorRepository.updateById(id, payload);
};

const deleteMonitor = async (id) => {
  await getMonitorById(id);
  await monitorRepository.deleteById(id);
};

const updateMonitorStatus = async (id, payload) => {
  await getMonitorById(id);
  return monitorRepository.updateById(id, payload);
};

module.exports = {
  createMonitor,
  listMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
  updateMonitorStatus,
};
