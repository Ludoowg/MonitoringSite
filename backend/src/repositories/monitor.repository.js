const prisma = require("../config/prisma");

const create = (data) => prisma.monitor.create({ data });

const findAll = () =>
  prisma.monitor.findMany({
    orderBy: { createdAt: "desc" },
  });

const findById = (id) =>
  prisma.monitor.findUnique({
    where: { id },
  });

const updateById = (id, data) =>
  prisma.monitor.update({
    where: { id },
    data,
  });

const deleteById = (id) =>
  prisma.monitor.delete({
    where: { id },
  });

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
};
