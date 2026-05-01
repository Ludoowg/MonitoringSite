const express = require("express");
const healthRoutes = require("./health.routes");
const monitorRoutes = require("./monitor.routes");
const checkRoutes = require("./check.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/monitors", monitorRoutes);
router.use("/", checkRoutes);

module.exports = router;
