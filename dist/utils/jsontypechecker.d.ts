export declare type TYPES = object | Function | Symbol | string | bigint | number | boolean | undefined;
export declare type TYPE_OPTIONS = "object" | "function" | "symbol" | "string" | "bigint" | "number" | "boolean" | "undefined";
export declare class JsonTypeChecker {
    static TYPE: {
        object: string;
        function: string;
        symbol: string;
        string: string;
        bigint: string;
        number: string;
        boolean: string;
        undefined: string;
    };
    static TYPE_CONSTRUCTORS: {
        object: (...args: Array<any>) => any;
        function: (...args: Array<any>) => any;
        symbol: (...args: Array<any>) => any;
        string: (...args: Array<any>) => any;
        bigint: (...args: Array<any>) => any;
        number: (...args: Array<any>) => any;
        boolean: (...args: Array<any>) => any;
        undefined: (...args: Array<any>) => undefined;
    };
    static type(str: string): TYPE_OPTIONS;
    static is(str: string, type: TYPE_OPTIONS): boolean;
    static instantiate(str: string): any;
}
