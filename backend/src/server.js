const app = require("./app");
const env = require("./config/env");
const prisma = require("./config/prisma");

const dotenv = require("dotenv");
dotenv.config();

const PORT = env.PORT || 5050;

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
