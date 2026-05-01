const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const healthController = require("../controllers/health.controller");

const router = express.Router();

router.get("/", asyncHandler(healthController.health));

module.exports = router;
