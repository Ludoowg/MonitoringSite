const { monitor } = require("../config/prisma");
const monitorRepository = require("../repositories/monitor.repository");
const ApiError = require("../utils/ApiError");
const { MONITOR_STATUS } = require("../utils/status");
const { monitorsByStatus } = require('../../metrics/prometheus_client')

const createMonitor = async (payload) =>
  monitorRepository.create({
    ...payload,
    status: MONITOR_STATUS.UNKNOWN,
  });

const listMonitors = async () => monitorRepository.findAll();

const updateMonitorsByStatusMetric = async() => {

  const monitors = await listMonitors(); 

    let countUNKNOWN = 0;
    let countUP = 0;
    let countDOWN = 0;
    let countSLOW = 0;

  for ( let x = 0; x < monitors.length; x++){

    if (monitors[x].status === MONITOR_STATUS.UNKNOWN) {
      countUNKNOWN++;
    }
    else if (monitors[x].status === MONITOR_STATUS.UP) {
      countUP++;
    }
    else if (monitors[x].status === MONITOR_STATUS.DOWN) {
      countDOWN++;
    }
    else if (monitors[x].status === MONITOR_STATUS.SLOW){
      countSLOW++;
    }

  }

  monitorsByStatus.set({ status: 'UNKNOWN' }, countUNKNOWN);
  monitorsByStatus.set({ status: 'UP' }, countUP);
  monitorsByStatus.set({ status: 'DOWN' }, countDOWN);
  monitorsByStatus.set({ status: 'SLOW' }, countSLOW);

}


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
  updateMonitorsByStatusMetric
};
