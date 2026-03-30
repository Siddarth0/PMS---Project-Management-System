import { ApiError } from "../utils/api-error.js";

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err?.errors || [],
    stack: process.env.NODE_ENV === "production" ? undefined : err?.stack,
  });
};

export { notFoundHandler, errorHandler };
