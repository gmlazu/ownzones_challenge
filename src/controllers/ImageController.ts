/**
 * @module Image
 */

import {NextFunction, Request, Response, Router} from "express";
import {IGetImageOptions, imageServiceInstance} from "../ImageService";
import {cache} from "../middleware/cache";

/**
 * Instance of the Express Router
 */
const router: Router = Router();

/**
 * Route GET /images/
 */
router.get("/", (req: Request, res: Response, next: NextFunction): void => {
    imageServiceInstance.getImages()
    .then((result: Array<string>) => {
        res.status(200).json(result);
    })
    .catch(next);
});

/**
 * Route GET /images/:fileName
 */
router.get("/:fileName", cache, (req: Request, res: Response, next: NextFunction): void => {
    const fileName: string = req.params.fileName;
    const querySize: string | undefined = req.query.size;
    let opts: IGetImageOptions | undefined;

    if (querySize) {
        const [w, h] = querySize.split("x");
        if (w && h) {
            opts = { width: parseInt(w), height: parseInt(h) };
        }
    }

    imageServiceInstance.getImage(fileName, opts)
        .then((image: Buffer) => {
            res.contentType("jpg")
                .header("X-Cache-Status", "miss")
                .status(200)
                .send(image);
        })
        .catch(next);
});

export const ImageController: Router = router;
