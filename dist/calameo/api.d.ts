/// <reference types="node" />
export default class CalameoAPI {
    static ENDPOINTS: {
        FETCH_DOCUMENT: string;
        FETCH_BOOK_PAGE: string;
        parse(endpoint: string, args: {}): string;
    };
    static getBookInfo(code: string): Promise<any>;
    static fetchBookPage(book_key: string, page: number, options?: {
        format?: string;
        head?: boolean;
    }): Promise<Buffer | {
        code: number;
        status: string;
        headers: {};
        content: Buffer | undefined;
    }>;
    static get(endpoint: string, headers?: {}): Promise<{
        code: number;
        status: string;
        headers: {};
        content: Buffer | undefined;
    }>;
    static head(endpoint: string, headers?: {}): Promise<{
        code: number;
        status: string;
        headers: {};
        content: Buffer | undefined;
    }>;
}
