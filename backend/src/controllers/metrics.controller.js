const { updateMonitorsByStatusMetric } = require('../services/monitor.service');
const checkService = require("../services/check.service");
const { register } = require('../../metrics/prometheus_client')

const getMetrics = async (_req, res) => {
    await updateMonitorsByStatusMetric();
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
}

module.exports = {
    getMetrics
}