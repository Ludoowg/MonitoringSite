const { z } = require("zod");

const monitorIdSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.uuid("id must be a valid UUID"),
  }),
  query: z.object({}).optional(),
});

module.exports = {
  monitorIdSchema,
};
