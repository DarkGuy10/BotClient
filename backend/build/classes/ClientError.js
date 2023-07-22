"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typings_1 = require("@/typings");
class ClientError extends Error {
    code;
    constructor(code) {
        super(`[${code}] ${typings_1.ClientErrorMessages[code]}`);
        this.code = code;
        this.name = 'ClientError';
    }
}
exports.default = ClientError;
