/**
 * @module Middleware
 */

import {ErrorRequestHandler, Request, Response, NextFunction} from "express";
import HTTPError from "../models/error/HTTPError";

/**
 * Middleware for handling errors
 * @param err Error to be handled
 * @param req Express request object
 * @param res Express response object
 * @param next next middleware
 */
export const errorHandler: ErrorRequestHandler = (err: HTTPError | Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HTTPError) {
        res.status(err.statusCode)
            .json(err.body);
    } else {
        res.status(500)
            .json(err)
    }
};
