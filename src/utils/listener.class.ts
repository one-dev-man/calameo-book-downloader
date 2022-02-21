export class Listener {
    _events: {[k: string]: Array<Function>} = {};

    constructor() {

    }

    //

    // get events() { return this._events instanceof Array ? this._events : null; }

    //

    on(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            this._events[event].push(callback);
        }
    }

    once(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            var _cb = (...args: any) => {
                this.removeListener(event, _cb);
                callback(args);
            }
            this._events[event].push(_cb);
        }
    }
    
    removeListener(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            if(this._events[event].indexOf(callback) != -1) {
                this._events[event] = removeIndexFromArray(this._events[event], this._events[event].indexOf(callback));
            }
        }
    }

    removeListeners(event: string) {
        for(var i = 0; i < this._events[event].length; i+=1) { this.removeListener(event, this._events[event][i]); }
    }

    off(event: string, callback: Function | null = null) {
        callback instanceof Function ? this.removeListener(event, callback) : this.removeListeners(event);
    }

    callEvent(event: string, ...args: any): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if(!(this._events[event] instanceof Array)) {
                this._events[event] = [];
            }
    
            if(this._events[event]) {
                if(this._events[event].length > 0) {
                    this._events[event].forEach(callback => {
                        setTimeout(() => {
                            resolve(callback(...args));
                        });
                    });
                }
                else reject();
            }
            else reject();
        });
    }
}

export class StaticListener {
    static _events: {[k: string]: Array<Function>} = {};

    constructor() {

    }

    //

    // static get events() { return this._events instanceof Array ? this._events : null; }

    //

    static on(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            this._events[event].push(callback);
        }
    }

    static once(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            var _cb = (...args: any) => {
                this.removeListener(event, _cb);
                callback(args);
            }
            this._events[event].push(_cb);
        }
    }
    
    static removeListener(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            if(this._events[event].indexOf(callback) != -1) {
                this._events[event] = removeIndexFromArray(this._events[event], this._events[event].indexOf(callback));
            }
        }
    }

    static removeListeners(event: string) {
        for(var i = 0; i < this._events[event].length; i+=1) { this.removeListener(event, this._events[event][i]); }
    }

    static off(event: string, callback: Function | null = null) {
        callback instanceof Function ? this.removeListener(event, callback) : this.removeListeners(event);
    }

    static callEvent(event: string, ...args: any): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if(!(this._events[event] instanceof Array)) {
                this._events[event] = [];
            }
    
            if(this._events[event]) {
                if(this._events[event].length > 0) {
                    this._events[event].forEach(callback => {
                        setTimeout(() => {
                            resolve(callback(...args));
                        });
                    });
                }
                else reject();
            }
            else reject();
        });
    }
}

export interface OBJECT_LISTENER_TYPE {
    _events: {[k: string]: Array<Function>},
    on(event: string, callback: Function): any,
    _on?(event: string, callback: Function): any,
    once(event: string, callback: Function): any,
    _once?(event: string, callback: Function): any,
    removeListener(event: string, callback: Function): any,
    _removeListener?(event: string, callback: Function): any,
    removeListeners(event: string): any,
    _removeListeners?(event: string): any,
    off(event: string, callback?: Function): any,
    _off?(event: string, callback?: Function): any,
    callEvent(event: string, ...args: any): Promise<unknown>
    _callEvent?(event: string, ...args: any): Promise<unknown>
}

const ObjectListener_: OBJECT_LISTENER_TYPE = {
    _events: {} as {[k: string]: Array<Function>},

    on(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            this._events[event].push(callback);
        }
    },
    
    once(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            var _cb = (...args: any) => {
                this.removeListener(event, _cb);
                callback(args);
            }
            this._events[event].push(_cb);
        }
    },
    
    removeListener(event: string, callback: Function) {
        if(!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }

        if(callback instanceof Function) {
            if(this._events[event].indexOf(callback) != -1) {
                this._events[event] = removeIndexFromArray(this._events[event], this._events[event].indexOf(callback));
            }
        }
    },
    
    removeListeners(event: string) {
        for(var i = 0; i < this._events[event].length; i+=1) { this.removeListener(event, this._events[event][i]); }
    },

    off(event: string, callback: Function | null = null) {
        callback instanceof Function ? this.removeListener(event, callback) : this.removeListeners(event);
    },
    
    callEvent(event: string, ...args: any): Promise<unknown> {
        return new Promise((resolve, reject) => {
            if(!(this._events[event] instanceof Array)) {
                this._events[event] = [];
            }
    
            if(this._events[event]) {
                if(this._events[event].length > 0) {
                    this._events[event].forEach(callback => {
                        setTimeout(() => {
                            resolve(callback(...args));
                        });
                    });
                }
                else reject();
            }
            else reject();
        });
    }
}

export const ObjectListener = {
    get(): OBJECT_LISTENER_TYPE {
        let r = {};
        Object.keys(ObjectListener_).forEach(k => { r[k] = ObjectListener_[k]; });
        return r as OBJECT_LISTENER_TYPE;
    },

    patch(l: OBJECT_LISTENER_TYPE) {
        Object.keys(l).forEach(k => {
            if(l[k] instanceof Function) {
                l["_"+k] = l[k];
                l[k] = function(...args: any): any { return l["_"+k](...args); }
            }
        });
        return l;
    }
}

//

function removeIndexFromArray(array: Array<any>, index: number): Array<any> {
    var a: Array<any> = [];
    var b: Array<any> = [];

    for(var i = 0; i < index; i+=1) { a.push(array[i]); }
    for(var i = index+1; i < array.length; i+=1) { a.push(array[i]); }

    var r: Array<any> = [];
    for(var i = 0; i < a.length; i+=1) { r.push(a[i]); }
    for(var i = 0; i < b.length; i+=1) { r.push(b[i]); }
    
    return r;
}