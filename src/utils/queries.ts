/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-const */

const queries = {
    get(_href_: string) {
        let r = { "#": {}, "?": {}, from: _href_ };
        let hash_parts = (new RegExp(/(\#.*)|(\?.*)/g).exec(_href_) || [""])[0].split("?");
        for(let i = 0; i < hash_parts.length; ++i) {
            hash_parts[i].split("&").forEach(h => { if(h.length > 0) { let _h = h.split("="); (r as any)[Object.keys(r)[i]][_h[0].startsWith(Object.keys(r)[i]) ? _h[0].substring(Object.keys(r)[i].length) : _h[0]] = _h[1]; } })
        }
        return r;
    },
    clear(_queries: { "#": {}, "?": {}, from: string }) {
        let r = { "#": _queries["#"], "?": _queries["?"], from: _queries.from };
        ["#", "?"].forEach(k => { (r as any)[k] = {}; });
        return r;
    },
    href: function(_queries: { "#": {}, "?": {}, from: string }) {
        let hash_regex = new RegExp(/(\#.*)|(\?.*)/g).exec(_queries.from);
        let _href = _queries.from.substring(0, _queries.from.length-(hash_regex || [""])[0].length);
        ["#", "?"].forEach(k => { if(Object.keys((_queries as any)[k]).length > 0) { _href += k; let parts = new Array<string>(); Object.keys((_queries as any)[k]).forEach(_k => { parts.push(_k+"="+(_queries as any)[k][_k]); }); _href += parts.join("&"); } });
        return _href;
    }
}

export default queries;