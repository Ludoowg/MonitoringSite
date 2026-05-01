const { ZodError } = require("zod");

const validate = (schema) => (req, _res, next) => {
  try {
    req.validated = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return next({
        statusCode: 400,
        message: error.issues[0]?.message || "Invalid request input",
      });
    }
    return next(error);
  }
};

module.exports = validate;
