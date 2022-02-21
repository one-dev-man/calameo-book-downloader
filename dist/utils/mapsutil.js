"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MapsUtil {
    static deepMerge(a, b, first = a) {
        let r = {};
        let _a = a;
        let _b = b;
        first == a || first == b ? first == b ? (() => { _a = b; _b = a; })() : null : null;
        let merge_callback = (k) => {
            if (this.isMap(_a[k]) && this.isMap(_b[k])) {
                _a[k] = this.deepMerge(_a[k], _b[k]);
            }
            r[k] = _a[k] != undefined ? _a[k] : _b[k];
        };
        Object.keys(_a).forEach(merge_callback);
        Object.keys(_b).forEach(merge_callback);
        return r;
    }
    static isMap(map_1) { return map_1 instanceof Object && !(map_1 instanceof Array); }
}
exports.default = MapsUtil;
