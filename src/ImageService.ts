/**
 * @module Image
 */

import HTTPError from "./models/error/HTTPError";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import {ImageCache} from "./models/ImageCache";

export interface IGetImageOptions {
    width: number;
    height: number;
}

/**
 * Service class for retrieval of images
 */
export class ImageService {
    private readonly imageCache: ImageCache = ImageCache.getInstance();
    private readonly storagePath: string;

    constructor(storagePath: string) {
        this.storagePath = storagePath;
    }

    /**
     * Retrieves an Image from /images/
     * @param fileName - the file name of the image
     * @param options - resize options
     * @returns Promise<[[Buffer]]>
     */
    public async getImage(fileName: string, options?: IGetImageOptions): Promise<Buffer> {
        // No options, no problem
        if (!options) {
            return this.readImage(fileName);
        }

        // Options exist, see if we have a cached image for that config
        const cacheKey: string = `${options.width}x${options.height}_${fileName}`;
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }

        // No cached image for that config, proceed with read & resize
        return this.readImage(fileName)
            .then((image: Buffer) => this.resizeImage(image, options))
            .then((resizedImage: Buffer) => {
                this.imageCache.set(cacheKey, resizedImage);
                return resizedImage;
            });
    };

    /**
     * Retrieves a list of file names representing the stored images
     * @returns Promise<Array<string>>
     */
    public getImages(): Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            fs.readdir(this.storagePath, (e, files: Array<string>) => {
                if (e) { // HTTP 404 for ENOENT, 500 for anything else
                    if (e.errno === -2) {
                        reject(new HTTPError(404, "Storage folder does not exist"));
                    } else {
                        reject(new HTTPError(500, e.message));
                    }
                }

                resolve(files);
            });
        });
    };

    /**
     * Reads an image from the image cache if found, or disk otherwise
     * @param fileName - name of the image to read
     */
    public readImage(fileName: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const filePath: string = path.join(this.storagePath, fileName);

            // Early exit if cached image found
            if (this.imageCache.has(fileName)) {
                return resolve(this.imageCache.get(fileName));
            }

            fs.readFile(filePath, (e, file: Buffer) => {
                if (e) { // HTTP 404 for ENOENT, 500 for anything else
                    if (e.errno === -2) {
                        return reject(new HTTPError(404, { error: `File not found` }));
                    } else {
                        return reject(new HTTPError(500, e.message));
                    }
                }

                // Cache newly read file
                this.imageCache.set(fileName, file);
                resolve(file);
            });
        });
    }

    /**
     * Resizes an image to the specified dimensions
     * @param image - [[Buffer]] representation of the image
     * @param options - resize options - [[IGetImageOptions]]
     */
    private resizeImage(image: Buffer, options: IGetImageOptions): Promise<Buffer> {
        return sharp(image)
            .resize({
                width: options.width,
                height: options.height,
                fit: "fill"
            })
            .toBuffer();
    }
}

export const imageServiceInstance: ImageService = new ImageService(path.join(__dirname, "images"));
