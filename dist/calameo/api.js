"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https = __importStar(require("https"));
const mapsutil_1 = __importDefault(require("../utils/mapsutil"));
const DEFAULT_HEADERS = {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
};
class CalameoAPI {
    //
    static async getBookInfo(code) {
        let r = await this.get(this.ENDPOINTS.parse(this.ENDPOINTS.FETCH_DOCUMENT, { code: code }));
        return eval(r.content.toString("utf-8"));
    }
    static async fetchBookPage(book_key, page, options) {
        options = options || {};
        options.format = options.format || "jpg";
        options.head = options.head != undefined ? options.head : false;
        let r = await (options.head ? this.head : this.get)(this.ENDPOINTS.parse(this.ENDPOINTS.FETCH_BOOK_PAGE, { book_key: book_key, page: page, format: options.format }));
        return options.head ? r : r.content;
    }
    //
    static async get(endpoint, headers = {}) {
        headers = mapsutil_1.default.deepMerge(headers, DEFAULT_HEADERS);
        return new Promise((resolve, reject) => {
            let r = { code: -1, status: "", headers: {}, content: undefined };
            let request = https.request(endpoint, { headers: headers, method: "GET" }, (response) => {
                r.code = response.statusCode || r.code;
                r.status = response.statusMessage || r.status;
                Object.keys(response.headers).forEach(h_k => { r.headers[h_k] = response.headers[h_k]; });
                let content_parts = new Array();
                response.on("data", d => { content_parts.push(Array.from(d)); });
                response.on("close", () => {
                    let content = new Array();
                    for (let i = 0; i < content_parts.length; ++i) {
                        content = content.concat(content_parts[i]);
                    }
                    r.content = Buffer.from(content);
                    resolve(r);
                });
                response.on("error", err => { reject(err); });
            }).on("error", err => { reject(err); });
            request.end();
        });
    }
    static async head(endpoint, headers = {}) {
        headers = mapsutil_1.default.deepMerge(headers, DEFAULT_HEADERS);
        return new Promise((resolve, reject) => {
            let r = { code: -1, status: "", headers: {}, content: undefined };
            let request = https.request(endpoint, { headers: headers, method: "HEAD" }, (response) => {
                r.code = response.statusCode || r.code;
                r.status = response.statusMessage || r.status;
                Object.keys(response.headers).forEach(h_k => { r.headers[h_k] = response.headers[h_k]; });
                resolve(r);
                response.on("error", err => { reject(err); });
            }).on("error", err => { reject(err); });
            request.end();
        });
    }
}
exports.default = CalameoAPI;
CalameoAPI.ENDPOINTS = {
    FETCH_DOCUMENT: "https://d.calameo.com/3.0.0/book.php?callback=eval&bkcode={{code}}",
    FETCH_BOOK_PAGE: "https://p.calameoassets.com/{{book_key}}/p{{page}}.{{format}}",
    parse(endpoint, args) {
        let r = endpoint;
        Object.keys(args).forEach(arg_key => {
            r = r.replace(new RegExp("{{" + arg_key + "}}"), args[arg_key]);
        });
        return r;
    }
};
