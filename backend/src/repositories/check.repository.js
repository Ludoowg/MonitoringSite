const prisma = require("../config/prisma");

const create = (data) => prisma.check.create({ data });

const findByMonitorId = (monitorId) =>
  prisma.check.findMany({
    where: { monitorId },
    orderBy: { checkedAt: "desc" },
  });

const findLatest = (limit = 50) =>
  prisma.check.findMany({
    take: limit,
    orderBy: { checkedAt: "desc" },
    include: {
      monitor: {
        select: { id: true, name: true, url: true, status: true },
      },
    },
  });

module.exports = {
  create,
  findByMonitorId,
  findLatest,
};
