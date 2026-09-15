const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { getMetrics } = require('../controllers/metrics.controller')

const router = express.Router();

router.get(
  "/",
  asyncHandler(getMetrics)
);

module.exports = router;