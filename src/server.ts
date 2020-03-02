/**
 * @module Server
 */

import express from "express";
import compression from "compression";
import cors from "cors";
import { ImageController } from "./controllers/ImageController";
import { Configuration, IExpressConfig } from "./models/Configuration";
import {errorHandler} from "./middleware/errorHandler";
import {HealthController} from "./controllers/HealthController";

/**
 * Express server instance
 */
const app: express.Application = express();
/**
 * Express configuration
 */
const config: IExpressConfig = Configuration.getInstance().getConfig().express;

// Configuration
app.use(compression()); // GZip compression middleware
app.use(cors()); // CORS middleware

// Routes
app.use(`/image`, ImageController);
app.use(`/health`, HealthController);

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Started the server on port ${config.port}`);
});
