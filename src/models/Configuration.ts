/**
 * @module Configuration
 */

import yml from "yaml";
import fs from "fs";
import path from "path";

/**
 * Representation of cache configuration
 */
interface ICacheConfig {
    /**
     * Time to live in seconds
     */
    ttl: number;
}

/**
 * Representation of express configuration
 */
interface IExpressConfig {
    /**
     * The port your server will run on
     */
    port: number;
}

/**
 * Representation of environment configuration
 */
interface IEnvConfig {
    /**
     * Express configuration object
     */
    express: IExpressConfig;
    /**
     * Cache configuration object
     */
    cache: ICacheConfig;
}

/**
 * Representation of configuration file
 */
interface IConfig {
    /**
     * Environment-specific configuration object
     */
    [env: string]: IEnvConfig;
}

/**
 * Singleton class for retrieving project configuration.
 * The environment variable `NODE_ENV` must be set to a value corresponding to a top-level configuration attribute,
 * The configuration file can be found under src/configuration/config.yml
 */
class Configuration {

    /**
     * Unique instance of the Configuration class
     */
    private static instance: Configuration;
    /**
     * The configuration object
     */
    private readonly config: IEnvConfig;

    private constructor(configPath: string) {
        const env: string | undefined = process.env.NODE_ENV;
        const ymlConfig: string = fs.readFileSync(configPath, "utf8");
        const config: IConfig = yml.parse(ymlConfig);

        if (!env) {
            throw new Error("NODE_ENV not set");
        }

        if (!config[env]) {
            throw new Error(`No configuration found for the ${env} environment`);
        }

        this.config = config[env];
    }

    /**
     * Retrieves the unique instance of Configuration
     * @returns [[Configuration]]
     */
    public static getInstance(): Configuration {
        if (!this.instance) {
            const configPath: string = path.join(__dirname, "../config.yml");
            this.instance = new Configuration(configPath);
        }

        return Configuration.instance;
    }

    /**
     * Retrieves the configuration for the current environment
     * @returns [[IEnvConfig]]
     */
    public getConfig(): IEnvConfig {
        return this.config;
    }


}

export { Configuration, ICacheConfig, IExpressConfig, IEnvConfig, IConfig };
