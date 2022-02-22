export default class Await {
    static async validContenxt(cb: () => boolean) {
        return await (() => {
            return new Promise((resolve, reject) => {
                let itv = setInterval(() => {
                    if(cb()) {
                        clearInterval(itv); resolve(true);
                    }
                });
            });
        })();
    }
}