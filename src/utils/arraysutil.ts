export default class ArraysUtil {

    static removeFromArray<T>(_array: Array<T>, _i: number) {
        let r = new Array<T>();
        for(let i = 0; i < _i; ++i) { r.push(_array[i]); }
        for(let i = _i+1; i < _array.length; ++i) { r.push(_array[i]); }
        return r;
    }

}