"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.color = void 0;
const COLOR_CODE = {
    TYPES: {
        RGB: {
            regexp: /§\{([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]),([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\}/g,
            parse: (code) => {
                let r = code.substring(2, code.length - 1);
                let rgb = r.split(",");
                return "\x1b[38;2;" + rgb[0] + ";" + rgb[1] + ";" + rgb[2] + "m";
            }
        },
        HEX: {
            regexp: /§\[\#([a-zA-Z]|[0-9])([a-zA-Z]|[0-9])([a-zA-Z]|[0-9])([a-zA-Z]|[0-9])([a-zA-Z]|[0-9])([a-zA-Z]|[0-9])\]/g,
            parse: (code) => {
                let r = code.substring(3, code.length - 1);
                let rgb = [];
                for (let i = 0; i < r.length; i += 2) {
                    rgb.push(r[i] + "" + r[i + 1], 16);
                }
                return "\x1b[38;2;" + rgb[0] + ";" + rgb[1] + ";" + rgb[2] + "m";
            }
        },
        HEX_LITE: {
            regexp: /§\[\#([a-zA-Z]|[0-9])([a-zA-Z]|[0-9])([a-zA-Z]|[0-9])\]/g,
            parse: (code) => {
                let r = code.substring(3, code.length - 1);
                let rgb = [];
                for (let i = 0; i < r.length; i += 1) {
                    rgb.push(r[i] + "" + r[i], 16);
                }
                return "\x1b[38;2;" + rgb[0] + ";" + rgb[1] + ";" + rgb[2] + "m";
            }
        },
        FONT: {
            regexp: /§(l|o|n|r|m)/g,
            parse: (code) => {
                let r = code.substring(1);
                return "\x1b[" + COLOR_CODE.FONT[r] + "m";
            }
        },
        COLORS_4_BITS: {
            regexp: /§([a-f]|[0-9])/g,
            parse: (code) => {
                let r = code.substring(1);
                let rgb = COLOR_CODE.COLORS_4_BITS[r];
                return "\x1b[38;2;" + rgb[0] + ";" + rgb[1] + ";" + rgb[2] + "m";
            }
        },
        FOREGROUND: {
            regexp: /\x1b\[@m\x1b\[38;/g,
            parse: (code) => {
                return "\x1b[48;";
            }
        }
    },
    FONT: {
        "l": "1",
        "o": "3",
        "n": "4",
        "r": "0",
        "m": "@" // Foreground (*)
    },
    COLORS_4_BITS: {
        "a": [85, 255, 85],
        "b": [85, 255, 255],
        "c": [255, 85, 85],
        "d": [255, 85, 255],
        "e": [255, 255, 85],
        "f": [255, 255, 255],
        "0": [0, 0, 0],
        "1": [0, 0, 170],
        "2": [0, 170, 0],
        "3": [0, 170, 170],
        "4": [170, 0, 0],
        "5": [170, 0, 170],
        "6": [255, 170, 0],
        "7": [170, 170, 170],
        "8": [85, 85, 85],
        "9": [85, 85, 255],
    }
};
const REGEX_EXCLUDED_SYMBOLS = [
    "\\",
    ".",
    "*",
    "+",
    "?",
    "|",
    "^",
    "$",
    "=",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}"
];
function format_to_exact_regexp(str) {
    let r = str;
    for (let i = 0; i < REGEX_EXCLUDED_SYMBOLS.length; ++i) {
        r = r.replace(new RegExp("\\" + REGEX_EXCLUDED_SYMBOLS[i], "g"), "\\" + REGEX_EXCLUDED_SYMBOLS[i]);
    }
    return new RegExp(r, "g");
}
function color(str) {
    let r = str + "§r";
    Object.keys(COLOR_CODE.TYPES).forEach(ct_k => {
        let ct = COLOR_CODE.TYPES[ct_k];
        let codes = r.match(ct.regexp);
        if (codes) {
            codes = codes?.filter((e, p) => { return codes?.indexOf(e) == p; }) || codes;
            for (let i = 0; i < codes?.length; ++i) {
                r = r.replace(format_to_exact_regexp(codes[i]), ct.parse(codes[i]));
            }
        }
    });
    return r;
}
exports.color = color;
