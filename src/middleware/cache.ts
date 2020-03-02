/**
 * @module Middleware
 */

import {NextFunction, Request, RequestHandler, Response} from "express";
import {ImageCache} from "../models/ImageCache";

/**
 * Middleware for intercepting image requests and serving cached content, if available
 * @param req Express request object
 * @param res Express response object
 * @param next next middleware
 */
export const cache: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const imageCache: ImageCache = ImageCache.getInstance();
    const fileName: string = req.params.fileName;
    const querySize: string | undefined = req.query.size;
    const cacheKey: string = querySize ? `${querySize}_${fileName}` : fileName;

    if (imageCache.has(cacheKey)) {
        const image: Buffer = imageCache.get(cacheKey);
        res.contentType("jpg")
            .header("X-Cache-Status", "hit")
            .status(200)
            .send(image)
    } else {
        // We have to make a call to get because of how
        // The library handles cache misses
        imageCache.get(cacheKey);
        next();
    }
};
