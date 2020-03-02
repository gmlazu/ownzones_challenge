/**
 * @module Health
 */

import {NextFunction, Request, Response, Router} from "express";
import {ImageCache} from "../models/ImageCache";
import NodeCache from "node-cache";

/**
 * Instance of the Express Router
 */
const router: Router = Router();

/**
 * Route GET /health/
 */
router.get("/", (req: Request, res: Response, next: NextFunction): void => {
    const imageCache: ImageCache = ImageCache.getInstance();
    const cacheStats: NodeCache.Stats = imageCache.getStats();

    res.status(200).json({
        cacheHits: cacheStats.hits,
        cacheMisses: cacheStats.misses
    });
});

export const HealthController: Router = router;
