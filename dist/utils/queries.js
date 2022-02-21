"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-const */
Object.defineProperty(exports, "__esModule", { value: true });
const queries = {
    get(_href_) {
        let r = { "#": {}, "?": {}, from: _href_ };
        let hash_parts = (new RegExp(/(\#.*)|(\?.*)/g).exec(_href_) || [""])[0].split("?");
        for (let i = 0; i < hash_parts.length; ++i) {
            hash_parts[i].split("&").forEach(h => { if (h.length > 0) {
                let _h = h.split("=");
                r[Object.keys(r)[i]][_h[0].startsWith(Object.keys(r)[i]) ? _h[0].substring(Object.keys(r)[i].length) : _h[0]] = _h[1];
            } });
        }
        return r;
    },
    clear(_queries) {
        let r = { "#": _queries["#"], "?": _queries["?"], from: _queries.from };
        ["#", "?"].forEach(k => { r[k] = {}; });
        return r;
    },
    href: function (_queries) {
        let hash_regex = new RegExp(/(\#.*)|(\?.*)/g).exec(_queries.from);
        let _href = _queries.from.substring(0, _queries.from.length - (hash_regex || [""])[0].length);
        ["#", "?"].forEach(k => { if (Object.keys(_queries[k]).length > 0) {
            _href += k;
            let parts = new Array();
            Object.keys(_queries[k]).forEach(_k => { parts.push(_k + "=" + _queries[k][_k]); });
            _href += parts.join("&");
        } });
        return _href;
    }
};
exports.default = queries;
