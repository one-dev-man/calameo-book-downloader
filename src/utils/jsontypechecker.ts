export type TYPES =
    object |
    Function |
    Symbol |
    string |
    bigint |
    number |
    boolean |
    undefined

export type TYPE_OPTIONS =
    "object" |
    "function" |
    "symbol" |
    "string" |
    "bigint" |
    "number" |
    "boolean" |
    "undefined";

export class JsonTypeChecker {

    static TYPE = {
        "object"    : "object",
        "function"  : "function",
        "symbol"    : "symbol",
        "string"    : "string",
        "bigint"    : "bigint",
        "number"    : "number",
        "boolean"   : "boolean",
        "undefined" : "undefined"
    };

    static TYPE_CONSTRUCTORS = {
        // "object"    : (...args: any) => { return new Object(...args); },
        "object"    : (...args: Array<any>) => { return eval("new Object("+args.join(",")+");"); },
        // "function"  : (...args: Array<any>) => { return Function(...args); },
        "function"  : (...args: Array<any>) => { return eval("new Function("+args.join(",")+");"); },
        // "symbol"    : (...args: Array<any>) => { return Symbol(args[0] as (string | number | undefined)); },
        "symbol"    : (...args: Array<any>) => { return eval("Symbol("+(args[0] as (string | number | undefined))+");"); },
        // "string"    : (...args: Array<any>) => { return new String(...args); },
        "string"    : (...args: Array<any>) => { return eval("new String("+args.join(",")+");"); },
        // "bigint"    : (...args: Array<any>) => { return BigInt(args[0] as (string | number | bigint | boolean)); },
        "bigint"    : (...args: Array<any>) => { return eval("BigInt("+(args[0] as (string | number | bigint | boolean))+");"); },
        // "number"    : (...args: Array<any>) => { return new Number(...args); },
        "number"    : (...args: Array<any>) => { return eval("new Number("+args.join(",")+");"); },
        // "boolean"   : (...args: Array<any>) => { return Boolean(args[0] as (string | number | bigint | boolean)); },
        "boolean"   : (...args: Array<any>) => { return eval("Boolean("+(args[0] as (string | number | bigint | boolean))+");"); },
        "undefined" : (...args: Array<any>) => { return undefined; }
    };

    //

    static type(str: string): TYPE_OPTIONS {
        try {
            let t = eval("typeof ("+str+")") as TYPE_OPTIONS;
            return t == this.TYPE.undefined ? this.TYPE.string as TYPE_OPTIONS : t;
        } catch(e) {
            try {
                return eval('typeof (\"'+str.replace(/\\/g, "\\\\")+'\")') as TYPE_OPTIONS;
            } catch(e) {
                return this.TYPE.string as TYPE_OPTIONS;
            }
        }
    }

    static is(str: string, type: TYPE_OPTIONS): boolean {
        return type == this.type(str);
    }

    static instantiate(str: string) {
        try {
            return (this.TYPE_CONSTRUCTORS as any)[this.type(str)](str);
        } catch(e) {
            try {
                return (this.TYPE_CONSTRUCTORS as any)[this.type(str)]('\"'+str.replace(/\\/g, "\\\\")+'\"');
            } catch(e) {
                return str;
            }
        }
    }

    //

}