const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate.middleware");
const checkController = require("../controllers/check.controller");
const { monitorIdSchema } = require("../validators/check.validator");

const router = express.Router();

router.post(
  "/monitors/:id/check",
  validate(monitorIdSchema),
  asyncHandler(checkController.runMonitorCheck)
);

router.get(
  "/monitors/:id/checks",
  validate(monitorIdSchema),
  asyncHandler(checkController.getMonitorChecks)
);

router.get("/checks", asyncHandler(checkController.getChecks));

module.exports = router;
