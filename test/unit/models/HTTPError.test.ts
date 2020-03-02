import HTTPError from "../../../src/models/error/HTTPError";
import { expect } from "chai";

describe('HTTPError', () => {
    const e: HTTPError = new HTTPError(404, { e: "Not found" }, { "X-Custom": "test" });

    it('should instantiate correctly', () => {
        expect(e.statusCode).to.eq(404);
        expect(e.body).to.eql({ e: "Not found" });
        expect(e.headers).to.eql({ "X-Custom": "test" });
    })
});
