"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTypeChecker = void 0;
class JsonTypeChecker {
    //
    static type(str) {
        try {
            let t = eval("typeof (" + str + ")");
            return t == this.TYPE.undefined ? this.TYPE.string : t;
        }
        catch (e) {
            try {
                return eval('typeof (\"' + str.replace(/\\/g, "\\\\") + '\")');
            }
            catch (e) {
                return this.TYPE.string;
            }
        }
    }
    static is(str, type) {
        return type == this.type(str);
    }
    static instantiate(str) {
        try {
            return this.TYPE_CONSTRUCTORS[this.type(str)](str);
        }
        catch (e) {
            try {
                return this.TYPE_CONSTRUCTORS[this.type(str)]('\"' + str.replace(/\\/g, "\\\\") + '\"');
            }
            catch (e) {
                return str;
            }
        }
    }
}
exports.JsonTypeChecker = JsonTypeChecker;
JsonTypeChecker.TYPE = {
    "object": "object",
    "function": "function",
    "symbol": "symbol",
    "string": "string",
    "bigint": "bigint",
    "number": "number",
    "boolean": "boolean",
    "undefined": "undefined"
};
JsonTypeChecker.TYPE_CONSTRUCTORS = {
    // "object"    : (...args: any) => { return new Object(...args); },
    "object": (...args) => { return eval("new Object(" + args.join(",") + ");"); },
    // "function"  : (...args: Array<any>) => { return Function(...args); },
    "function": (...args) => { return eval("new Function(" + args.join(",") + ");"); },
    // "symbol"    : (...args: Array<any>) => { return Symbol(args[0] as (string | number | undefined)); },
    "symbol": (...args) => { return eval("Symbol(" + args[0] + ");"); },
    // "string"    : (...args: Array<any>) => { return new String(...args); },
    "string": (...args) => { return eval("new String(" + args.join(",") + ");"); },
    // "bigint"    : (...args: Array<any>) => { return BigInt(args[0] as (string | number | bigint | boolean)); },
    "bigint": (...args) => { return eval("BigInt(" + args[0] + ");"); },
    // "number"    : (...args: Array<any>) => { return new Number(...args); },
    "number": (...args) => { return eval("new Number(" + args.join(",") + ");"); },
    // "boolean"   : (...args: Array<any>) => { return Boolean(args[0] as (string | number | bigint | boolean)); },
    "boolean": (...args) => { return eval("Boolean(" + args[0] + ");"); },
    "undefined": (...args) => { return undefined; }
};
