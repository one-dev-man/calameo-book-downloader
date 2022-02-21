"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualKeyBoard = void 0;
class VirtualKeyBoard {
    //
    static is(key, v_key) {
        return (key.name == v_key.name)
            && (key.ctrl ? true : false) == (v_key.ctrl ? true : false)
            && (key.meta ? true : false) == (v_key.meta ? true : false)
            && (key.shift ? true : false) == (v_key.shift ? true : false);
    }
    //
    static parse(str, key, index = str.length) {
        let r = str;
        let kit_keys = Object.keys(this.KEYS.INTERACTIONS.TEXT);
        let used_key = null;
        for (let i = 0; i < kit_keys.length; ++i) {
            if (this.is(key, this.KEYS.INTERACTIONS.TEXT[kit_keys[i]])) {
                used_key = this.KEYS.INTERACTIONS.TEXT[kit_keys[i]];
                break;
            }
        }
        return used_key ? used_key.execute(r, index) : { line: r.substring(0, index) + key.sequence + r.substring(index, r.length), index: index + 1 };
    }
}
exports.VirtualKeyBoard = VirtualKeyBoard;
VirtualKeyBoard.KEYS = {
    INTERACTIONS: {
        TEXT: {
            TAB: {
                name: "tab",
                execute: (str, index) => {
                    return {
                        line: str.substring(0, index) + "    " + str.substring(index, str.length),
                        index: index + 4
                    };
                }
            },
            BACKSPACE: {
                name: "backspace",
                execute: (str, index) => {
                    return {
                        line: str.substring(0, index - 1) + str.substring(index, str.length),
                        index: index > 0 ? index - 1 : index
                    };
                }
            },
            LARGE_BACKSPACE: {
                name: "w",
                ctrl: true,
                execute: (str, index) => {
                    return {
                        line: str.substring(0, str.substring(0, index).lastIndexOf(" ")) + str.substring(index, str.length),
                        index: str.substring(0, index).lastIndexOf(" ")
                    };
                }
            },
            DELETE: {
                name: "delete",
                execute: (str, index) => {
                    return {
                        line: str.substring(0, index) + str.substring(index + 1, str.length),
                        index: index
                    };
                }
            },
            LAGE_DELETE: {
                name: "d",
                meta: true,
                execute: (str, index) => {
                    return {
                        line: str.substring(0, index) + str.substring(index, str.substring(index, str.length).indexOf(" ")),
                        index: index
                    };
                }
            },
            NEW_LINE: {
                name: "return",
                meta: true,
                execute: (str, index) => {
                    return {
                        line: str.substring(0, index) + "\n" + str.substring(index, str.length),
                        index: index + 1
                    };
                }
            }
        },
        TERMINAL: {
            EXIT: { name: "c", ctrl: true },
            RETURN: { name: "return" },
            UP: { name: "up" },
            DOWN: { name: "down" },
            LEFT: { name: "left" },
            QUICK_LEFT: { name: "left", ctrl: true },
            RIGHT: { name: "right" },
            QUICK_RIGHT: { name: "right", ctrl: true },
            HOME: { name: "home" },
            END: { name: "end" },
            ESCAPE: { name: "escape", meta: true }
        }
    }
};
