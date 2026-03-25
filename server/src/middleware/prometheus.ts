import type { Request, Response, NextFunction } from "express";
import { httpRequestDuration } from "../metrics.js";

export function prometheusMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    // Skip recording the /metrics scrape itself to avoid feedback loop
    if (req.path === "/metrics") return;
    const route = req.route?.path
      ? req.baseUrl + req.route.path
      : req.path;
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    httpRequestDuration
      .labels(req.method, route, String(res.statusCode))
      .observe(durationSeconds);
  });
  next();
}
