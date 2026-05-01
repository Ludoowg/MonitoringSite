const { z } = require("zod");

const monitorBodySchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  url: z.url("url must be a valid URL"),
});

const monitorUpdateBodySchema = z
  .object({
    name: z.string().trim().min(1, "name cannot be empty").optional(),
    url: z.url("url must be a valid URL").optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

const monitorIdParamsSchema = z.object({
  id: z.uuid("id must be a valid UUID"),
});

const createMonitorSchema = z.object({
  body: monitorBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const updateMonitorSchema = z.object({
  body: monitorUpdateBodySchema,
  params: monitorIdParamsSchema,
  query: z.object({}).optional(),
});

const monitorIdSchema = z.object({
  body: z.object({}).optional(),
  params: monitorIdParamsSchema,
  query: z.object({}).optional(),
});

module.exports = {
  createMonitorSchema,
  updateMonitorSchema,
  monitorIdSchema,
};
