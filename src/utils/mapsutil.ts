export default class MapsUtil {

    static deepMerge<T = any>(a: T, b: T, first: T = a): T {
        let r: any = {};

        let _a = a;
        let _b = b;
        first == a || first == b ? first == b ? (() => { _a = b; _b = a; })() : null : null;

        let merge_callback = (k: any) => {
            if(this.isMap((_a as any)[k]) && this.isMap((_b as any)[k])) {
                (_a as any)[k] = this.deepMerge((_a as any)[k], (_b as any)[k]);
            }
            r[k] = (_a as any)[k] != undefined ? (_a as any)[k] : (_b as any)[k];
        };

        Object.keys(_a).forEach(merge_callback);
        Object.keys(_b).forEach(merge_callback);

        return r;
    }

    static isMap<T = any>(map_1: T) { return map_1 instanceof Object && !(map_1 instanceof Array); }

}