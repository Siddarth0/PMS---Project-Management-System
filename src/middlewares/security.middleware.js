import crypto from "crypto";

const setSecurityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("X-Request-Id", req.requestId);
  next();
};

const assignRequestId = (req, _res, next) => {
  req.requestId = crypto.randomUUID();
  next();
};

const createRateLimiter = ({ windowMs = 60_000, max = 100 } = {}) => {
  const hits = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();

    const entry = hits.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    entry.count += 1;
    hits.set(key, entry);

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later.",
      });
    }

    next();
  };
};

export { assignRequestId, createRateLimiter, setSecurityHeaders };
