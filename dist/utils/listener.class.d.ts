export declare class Listener {
    _events: {
        [k: string]: Array<Function>;
    };
    constructor();
    on(event: string, callback: Function): void;
    once(event: string, callback: Function): void;
    removeListener(event: string, callback: Function): void;
    removeListeners(event: string): void;
    off(event: string, callback?: Function | null): void;
    callEvent(event: string, ...args: any): Promise<unknown>;
}
export declare class StaticListener {
    static _events: {
        [k: string]: Array<Function>;
    };
    constructor();
    static on(event: string, callback: Function): void;
    static once(event: string, callback: Function): void;
    static removeListener(event: string, callback: Function): void;
    static removeListeners(event: string): void;
    static off(event: string, callback?: Function | null): void;
    static callEvent(event: string, ...args: any): Promise<unknown>;
}
export interface OBJECT_LISTENER_TYPE {
    _events: {
        [k: string]: Array<Function>;
    };
    on(event: string, callback: Function): any;
    _on?(event: string, callback: Function): any;
    once(event: string, callback: Function): any;
    _once?(event: string, callback: Function): any;
    removeListener(event: string, callback: Function): any;
    _removeListener?(event: string, callback: Function): any;
    removeListeners(event: string): any;
    _removeListeners?(event: string): any;
    off(event: string, callback?: Function): any;
    _off?(event: string, callback?: Function): any;
    callEvent(event: string, ...args: any): Promise<unknown>;
    _callEvent?(event: string, ...args: any): Promise<unknown>;
}
export declare const ObjectListener: {
    get(): OBJECT_LISTENER_TYPE;
    patch(l: OBJECT_LISTENER_TYPE): OBJECT_LISTENER_TYPE;
};
