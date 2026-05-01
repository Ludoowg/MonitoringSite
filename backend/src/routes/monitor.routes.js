const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate.middleware");
const monitorController = require("../controllers/monitor.controller");
const {
  createMonitorSchema,
  updateMonitorSchema,
  monitorIdSchema,
} = require("../validators/monitor.validator");

const router = express.Router();

router.post(
  "/",
  validate(createMonitorSchema),
  asyncHandler(monitorController.createMonitor)
);

router.get("/", asyncHandler(monitorController.getMonitors));

router.get(
  "/:id",
  validate(monitorIdSchema),
  asyncHandler(monitorController.getMonitorById)
);

router.patch(
  "/:id",
  validate(updateMonitorSchema),
  asyncHandler(monitorController.updateMonitor)
);

router.delete(
  "/:id",
  validate(monitorIdSchema),
  asyncHandler(monitorController.deleteMonitor)
);

module.exports = router;
