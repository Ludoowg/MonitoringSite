const client = require('@prometheus-io/client');

const Registry = client.Registry;
const register = new Registry();

client.collectDefaultMetrics({ register });

const monitorsByStatus = new client.Gauge({ 
    name: 'monitoring_monitors', 
    help: 'Number of monitors by status',
    labelNames: ['status'],
    registers: [register]
});

module.exports = {
    register, 
    monitorsByStatus
}