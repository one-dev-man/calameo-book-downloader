"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Await {
    static async validContenxt(cb) {
        return await (() => {
            return new Promise((resolve, reject) => {
                let itv = setInterval(() => {
                    if (cb()) {
                        clearInterval(itv);
                        resolve(true);
                    }
                });
            });
        })();
    }
}
exports.default = Await;
