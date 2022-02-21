"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ArraysUtil {
    static removeFromArray(_array, _i) {
        let r = new Array();
        for (let i = 0; i < _i; ++i) {
            r.push(_array[i]);
        }
        for (let i = _i + 1; i < _array.length; ++i) {
            r.push(_array[i]);
        }
        return r;
    }
}
exports.default = ArraysUtil;
