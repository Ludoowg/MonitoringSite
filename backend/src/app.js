const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");
const routes = require("./routes");
const metricsRoute = require("./routes/metrics.routes");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/error.middleware");
const prometheusMiddleware = require("./middlewares/prometheus.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(prometheusMiddleware);
app.use("/metrics", metricsRoute);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
