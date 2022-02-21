"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectListener = exports.StaticListener = exports.Listener = void 0;
class Listener {
    constructor() {
        this._events = {};
    }
    //
    // get events() { return this._events instanceof Array ? this._events : null; }
    //
    on(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            this._events[event].push(callback);
        }
    }
    once(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            var _cb = (...args) => {
                this.removeListener(event, _cb);
                callback(args);
            };
            this._events[event].push(_cb);
        }
    }
    removeListener(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            if (this._events[event].indexOf(callback) != -1) {
                this._events[event] = removeIndexFromArray(this._events[event], this._events[event].indexOf(callback));
            }
        }
    }
    removeListeners(event) {
        for (var i = 0; i < this._events[event].length; i += 1) {
            this.removeListener(event, this._events[event][i]);
        }
    }
    off(event, callback = null) {
        callback instanceof Function ? this.removeListener(event, callback) : this.removeListeners(event);
    }
    callEvent(event, ...args) {
        return new Promise((resolve, reject) => {
            if (!(this._events[event] instanceof Array)) {
                this._events[event] = [];
            }
            if (this._events[event]) {
                if (this._events[event].length > 0) {
                    this._events[event].forEach(callback => {
                        setTimeout(() => {
                            resolve(callback(...args));
                        });
                    });
                }
                else
                    reject();
            }
            else
                reject();
        });
    }
}
exports.Listener = Listener;
class StaticListener {
    constructor() {
    }
    //
    // static get events() { return this._events instanceof Array ? this._events : null; }
    //
    static on(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            this._events[event].push(callback);
        }
    }
    static once(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            var _cb = (...args) => {
                this.removeListener(event, _cb);
                callback(args);
            };
            this._events[event].push(_cb);
        }
    }
    static removeListener(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            if (this._events[event].indexOf(callback) != -1) {
                this._events[event] = removeIndexFromArray(this._events[event], this._events[event].indexOf(callback));
            }
        }
    }
    static removeListeners(event) {
        for (var i = 0; i < this._events[event].length; i += 1) {
            this.removeListener(event, this._events[event][i]);
        }
    }
    static off(event, callback = null) {
        callback instanceof Function ? this.removeListener(event, callback) : this.removeListeners(event);
    }
    static callEvent(event, ...args) {
        return new Promise((resolve, reject) => {
            if (!(this._events[event] instanceof Array)) {
                this._events[event] = [];
            }
            if (this._events[event]) {
                if (this._events[event].length > 0) {
                    this._events[event].forEach(callback => {
                        setTimeout(() => {
                            resolve(callback(...args));
                        });
                    });
                }
                else
                    reject();
            }
            else
                reject();
        });
    }
}
exports.StaticListener = StaticListener;
StaticListener._events = {};
const ObjectListener_ = {
    _events: {},
    on(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            this._events[event].push(callback);
        }
    },
    once(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            var _cb = (...args) => {
                this.removeListener(event, _cb);
                callback(args);
            };
            this._events[event].push(_cb);
        }
    },
    removeListener(event, callback) {
        if (!(this._events[event] instanceof Array)) {
            this._events[event] = [];
        }
        if (callback instanceof Function) {
            if (this._events[event].indexOf(callback) != -1) {
                this._events[event] = removeIndexFromArray(this._events[event], this._events[event].indexOf(callback));
            }
        }
    },
    removeListeners(event) {
        for (var i = 0; i < this._events[event].length; i += 1) {
            this.removeListener(event, this._events[event][i]);
        }
    },
    off(event, callback = null) {
        callback instanceof Function ? this.removeListener(event, callback) : this.removeListeners(event);
    },
    callEvent(event, ...args) {
        return new Promise((resolve, reject) => {
            if (!(this._events[event] instanceof Array)) {
                this._events[event] = [];
            }
            if (this._events[event]) {
                if (this._events[event].length > 0) {
                    this._events[event].forEach(callback => {
                        setTimeout(() => {
                            resolve(callback(...args));
                        });
                    });
                }
                else
                    reject();
            }
            else
                reject();
        });
    }
};
exports.ObjectListener = {
    get() {
        let r = {};
        Object.keys(ObjectListener_).forEach(k => { r[k] = ObjectListener_[k]; });
        return r;
    },
    patch(l) {
        Object.keys(l).forEach(k => {
            if (l[k] instanceof Function) {
                l["_" + k] = l[k];
                l[k] = function (...args) { return l["_" + k](...args); };
            }
        });
        return l;
    }
};
//
function removeIndexFromArray(array, index) {
    var a = [];
    var b = [];
    for (var i = 0; i < index; i += 1) {
        a.push(array[i]);
    }
    for (var i = index + 1; i < array.length; i += 1) {
        a.push(array[i]);
    }
    var r = [];
    for (var i = 0; i < a.length; i += 1) {
        r.push(a[i]);
    }
    for (var i = 0; i < b.length; i += 1) {
        r.push(b[i]);
    }
    return r;
}
