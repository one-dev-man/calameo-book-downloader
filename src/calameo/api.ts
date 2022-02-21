import * as https from "https";
import MapsUtil from "../utils/mapsutil";

const DEFAULT_HEADERS = {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
}

export default class CalameoAPI {

    static ENDPOINTS = {
        FETCH_DOCUMENT: "https://d.calameo.com/3.0.0/book.php?callback=eval&bkcode={{code}}",
        FETCH_BOOK_PAGE: "https://p.calameoassets.com/{{book_key}}/p{{page}}.{{format}}",

        parse(endpoint: string, args: {}) {
            let r = endpoint;
            Object.keys(args).forEach(arg_key => {
                r = r.replace(new RegExp("{{"+arg_key+"}}"), args[arg_key]);
            })
            return r;
        }
    }

    //

    static async getBookInfo(code: string) {
        let r = await this.get(this.ENDPOINTS.parse(this.ENDPOINTS.FETCH_DOCUMENT, { code: code }));
        return eval((r.content as Buffer).toString("utf-8"));
    }

    static async fetchBookPage(book_key: string, page: number, options?: { format?: string, head?: boolean }) {
        options = options || {};

        options.format = options.format || "jpg";
        options.head = options.head != undefined ? options.head : false;

        let r = await (options.head ? this.head : this.get)(this.ENDPOINTS.parse(this.ENDPOINTS.FETCH_BOOK_PAGE, { book_key: book_key, page: page, format: options.format }));
        return options.head ? r : r.content as Buffer;
    }

    //

    static async get(endpoint: string, headers: {}={}) {
        headers = MapsUtil.deepMerge(headers, DEFAULT_HEADERS);

        return new Promise<{
            code: number,
            status: string,
            headers: {},
            content: Buffer | undefined
        }> ((resolve, reject) => {
            let r: { code: number, status: string, headers: {}, content: Buffer | undefined } = { code: -1, status: "", headers: {}, content: undefined } as any;

            let request = https.request(endpoint, { headers: headers, method: "GET" }, (response) => {
                r.code = response.statusCode || r.code;
                r.status = response.statusMessage || r.status;
                Object.keys(response.headers).forEach(h_k => { r.headers[h_k] = response.headers[h_k]; });

                let content_parts = new Array<Array<any>>();
                response.on("data", d => { content_parts.push(Array.from(d)); });
                response.on("close", () => {
                    let content = new Array<any>();
                    for(let i = 0; i < content_parts.length; ++i) { content = content.concat(content_parts[i]); }
                    r.content = Buffer.from(content);

                    resolve(r);
                });

                response.on("error", err => { reject(err); });
            }).on("error", err => { reject(err); });

            request.end();
     });
   }

    static async head(endpoint: string, headers: {}={}) {
        headers = MapsUtil.deepMerge(headers, DEFAULT_HEADERS);
        
        return new Promise<{
            code: number,
            status: string,
            headers: {},
            content: Buffer | undefined
        }> ((resolve, reject) => {
            let r: { code: number, status: string, headers: {}, content: Buffer | undefined } = { code: -1, status: "", headers: {}, content: undefined } as any;

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