import { expect } from "chai";
import {IGetImageOptions, ImageService, imageServiceInstance} from "../../src/ImageService";
import {ImageCache} from "../../src/models/ImageCache";
import NodeCache from "node-cache";
import sharp, {OutputInfo} from "sharp";
import path from "path";
import fs from "fs";
import HTTPError from "../../src/models/error/HTTPError";

describe('ImageService', () => {
    const imageService: ImageService = imageServiceInstance;
    const imageCache: ImageCache = ImageCache.getInstance();

    describe('when I ask to retrieve a list of all images', () => {
        describe('and the destination folder does not exist', () => {
            const badImageService: ImageService = new ImageService("./missing_folder");

            it('should throw a 404 error', () => {
                return badImageService.getImages()
                    .then(() => {
                        expect.fail("Promise.resolve", "Promise.reject");
                    }).catch((e: HTTPError) => {
                        expect(e).to.be.instanceOf(HTTPError);
                        expect(e.statusCode).to.be.eq(404);
                    });
            })
        });

        describe('and the destination folder exists', () => {
            it('should retrieve a list of all images', () => {
                return imageService.getImages()
                    .then((imageList: Array<string>) => {
                        expect(imageList.length).to.eq(345);
                    });
            })
        });
    });

    describe('when I ask to retrieve an image', () => {
        describe('and the image does not exist', () => {
            const fileName: string = "missing_img.jpg";

            it('should throw a 404 error', () => {
                return imageService.getImage(fileName)
                    .then(() => {
                        expect.fail("Promise.resolve", "Promise.reject");
                    }).catch((e: HTTPError) => {
                        expect(e).to.be.instanceOf(HTTPError);
                        expect(e.statusCode).to.be.eq(404);
                    });

            });
        });

        describe('and I ask for an image in the original size', () => {
            const fileName: string = "457328320_13147478.jpg";

            it('should retrieve the requested image', () => {
                return imageService.getImage(fileName)
                    .then((image: Buffer) => {
                        expect(image).to.be.instanceOf(Buffer);
                    })

            });
            it('should have that image in cache', () => {
                expect(imageCache.get(fileName)).to.be.instanceOf(Buffer);
            });
        });

        describe('and I ask for an image to be resized', () => {
            const fileName: string = "404416776_13147478.jpg";
            const options: IGetImageOptions = { width: 600, height: 400 };

            it('should retrieve the requested image resized', () => {
                return imageService.getImage(fileName, options)
                    .then((image: Buffer) => {
                        return sharp(image)
                            .toBuffer({ resolveWithObject: true })
                            .then((result: { data: Buffer; info: OutputInfo; }) => {
                                expect(result.info.width).to.eq(options.width);
                                expect(result.info.height).to.eq(options.height);
                            })
                    })
            });
            it('should have resized the file and cached it', () => {
                const cacheKey: string = `${options.width}x${options.height}_${fileName}`;
                const cachedImage: Buffer = imageCache.get(cacheKey);
                expect(cachedImage).to.be.instanceOf(Buffer);

                return sharp(cachedImage)
                    .toBuffer({ resolveWithObject: true })
                    .then((result: { data: Buffer; info: OutputInfo; }) => {
                        expect(result.info.width).to.eq(options.width);
                        expect(result.info.height).to.eq(options.height);
                    })
            });
        });

        describe('and I ask for a cached image to be resized', () => {
            const fileName: string = "404416776_13147478.jpg";
            const options: IGetImageOptions = { width: 600, height: 400 };

            it('should retrieve the requested image resized', () => {
                return imageService.getImage(fileName, options)
                    .then((image: Buffer) => {
                        return sharp(image)
                            .toBuffer({ resolveWithObject: true })
                            .then((result: { data: Buffer; info: OutputInfo; }) => {
                                expect(result.info.width).to.eq(options.width);
                                expect(result.info.height).to.eq(options.height);
                            })
                    })
            });
            it('should have retrieved the file from cache', () => {
                const cacheStats: NodeCache.Stats = imageCache.getStats();

                expect(cacheStats.hits).to.eq(3);
            });
        });
    });
});
