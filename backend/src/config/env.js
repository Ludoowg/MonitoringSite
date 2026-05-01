const dotenv = require("dotenv");

dotenv.config();

const env = {
  PORT: Number(process.env.PORT),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  HTTP_CHECK_TIMEOUT_MS: Number(process.env.HTTP_CHECK_TIMEOUT_MS || 5000),
  SLOW_THRESHOLD_MS: Number(process.env.SLOW_THRESHOLD_MS || 2000),
};

module.exports = env;
