/**
 * @module Image
 */

import NodeCache from "node-cache";
import {Configuration, ICacheConfig} from "./Configuration"

export class ImageCache {
    /**
     * Unique instance of the ImageCache class
     */
    private static instance: ImageCache;
    private readonly cache: NodeCache;
    private readonly options: { stdTTL: number; };

    private constructor(options: { stdTTL: number; }) {
        this.options = options;
        this.cache = new NodeCache(options);
    }

    /**
     * Retrieves the unique instance of ImageCache
     * @returns [[ImageCache]]
     */
    public static getInstance(): ImageCache {
        if (!this.instance) {
            const config: ICacheConfig = Configuration.getInstance().getConfig().cache;
            this.instance = new ImageCache({
                stdTTL: config.ttl
            });
        }

        return this.instance;
    }

    /**
     * Search for a key in the cache
     * @param key - lookup key
     * @returns boolean to determine if key exists
     */
    public has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Get the value for a key in the cache
     * @param key - lookup key
     * @returns stored value
     */
    public get(key: string): any {
        return this.cache.get(key);
    }

    /**
     * Store a key and a value in the cache
     * @param key - lookup key
     * @param obj - stored data
     * @param ttl - expiry time in seconds
     * @returns boolean to determine if successful
     */
    public set(key: string, obj: any, ttl?: number | string): boolean {
        // This call to node-cache.set makes a subsequent call to an internal
        // Function _getValLength in order to keep track of cache size
        // This function makes a call to Object.keys(value) where `value` is the stored obj.
        // When doing Object.keys on a Buffer representation of an image, the call takes
        // On avg 29% more time to finish. Solution? wrap the image in an object
        return this.cache.set(key, obj, ttl || this.options.stdTTL);
    }

    /**
     * Delete stored key/value pair
     * @param key - lookup key
     * @returns number of deleted keys
     */
    public del(key: string): any {
        return this.cache.del(key);
    }

    /**
     * Retrieve statistics about this cache
     * @returns NodeCache.Stats - stats object
     */
    public getStats(): NodeCache.Stats {
        return this.cache.getStats();
    }
}
