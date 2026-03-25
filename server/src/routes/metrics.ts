import { Router } from "express";
import { metricsRegistry } from "../metrics.js";

export function metricsRoutes(): Router {
  const router = Router();
  router.get("/", async (_req, res) => {
    try {
      const output = await metricsRegistry.metrics();
      res.set("Content-Type", metricsRegistry.contentType);
      res.end(output);
    } catch (err) {
      res.status(500).end(String(err));
    }
  });
  return router;
}
