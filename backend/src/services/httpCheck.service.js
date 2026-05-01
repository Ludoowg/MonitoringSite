const axios = require("axios");
const env = require("../config/env");
const { MONITOR_STATUS } = require("../utils/status");

const runHttpCheck = async (url) => {
  const startedAt = Date.now();
  try {
    const response = await axios.get(url, {
      timeout: env.HTTP_CHECK_TIMEOUT_MS,
      validateStatus: () => true,
    });

    const responseTimeMs = Date.now() - startedAt;
    const statusCode = response.status;

    let status = MONITOR_STATUS.DOWN;
    if (statusCode >= 200 && statusCode <= 399) {
      status =
        responseTimeMs > env.SLOW_THRESHOLD_MS
          ? MONITOR_STATUS.SLOW
          : MONITOR_STATUS.UP;
    }

    if (statusCode >= 400) {
      status = MONITOR_STATUS.DOWN;
    }

    return {
      status,
      statusCode,
      responseTimeMs,
      errorMessage: null,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startedAt;
    return {
      status: MONITOR_STATUS.DOWN,
      statusCode: error.response?.status || null,
      responseTimeMs,
      errorMessage: error.message || "Network error",
    };
  }
};

module.exports = {
  runHttpCheck,
};
