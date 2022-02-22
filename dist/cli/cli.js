"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Environment_array_dictionary, _Environment_dictionary, _Command_label, _Command_help, _Command_callback, _CLI_env_env, _CLI_argv_env, _CLI_commands, _CLI_startup_message, _CLI_prefix, _CLI_suffix, _CLI_history, _CLI_h_i, _CLI_tmp_line, _CLI_cursor, _CLI_old_line_size, _CLI_line, _CLI_closed, _CLI_print_compiled_prompt, _CLI_live_stdin_data_callback;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = exports.Command = exports.Environment = void 0;
const readline = __importStar(require("readline"));
const listener_class_1 = require("../utils/listener.class");
const arraysutil_1 = __importDefault(require("../utils/arraysutil"));
const jsontypechecker_1 = require("../utils/jsontypechecker");
const colors_1 = require("./colors");
const vkb_1 = require("./vkb");
// DEFAULT COMMANDS :
const DEFAULT_COMMANDS = {
    exit: {
        label: "exit",
        help: "exit - Exit the program.",
        callback: async (label, args, cli) => {
            process.exit(0);
            // return true;
        }
    },
    help: {
        label: "help",
        help: "[<command>] - Show commands usage or specific command usage.",
        callback: async (label, args, cli) => {
            if (args.length < 1) {
                let cmds = cli.getCommands();
                console["__log"]("Commands usage :");
                for (let i = 0; i < cmds.length; ++i) {
                    let cmd = cmds[i];
                    console["__log"](" - " + cmd.label + " : " + cmd.help);
                }
            }
            else {
                if (cli.hasCommand(args[0])) {
                    let cmd = cli.getCommand(args[0]);
                    console["__log"]("Command usage :");
                    console["__log"](" - " + cmd.label + " : " + cmd.help);
                }
                else {
                    console["__log"]("Command \"" + args[0] + "\" not found.");
                }
            }
        }
    },
    // history: {
    //     label: ".history",
    //     callback: async (label: string, args: Array<any>, cli: any) => {
    //         console.log("| Commands history :");
    //         cli.history.pop();
    //         for(let i = 0; i < cli.history.length; ++i) {
    //             console.log("| - "+cli.history[i]);
    //         }
    //         return true;
    //     }
    // },
    // previous: {
    //     label: ".previous",
    //     callback: async (label: string, args: Array<any>, cli: any) => {
    //         cli.history.pop();
    //         cli.live_stdin_data_callback(Buffer.from(0 < cli.history.length-1 < cli.history.length ? cli.history[cli.history.length-1] : ""));
    //         return true;
    //     }
    // }
};
// DEFAULT_COMMANDS["hist"] = {
//     label: ".hist",
//     callback: DEFAULT_COMMANDS.history.callback
// }
// DEFAULT_COMMANDS["prev"] = {
//     label: ".prev",
//     callback: DEFAULT_COMMANDS.previous.callback
// }
//
class Environment {
    constructor(...toConvert_parts) {
        //
        this.ARG_FIRST_COMMAND_LABEL_KEY = "AFCL_" + Date.now();
        _Environment_array_dictionary.set(this, new Array());
        _Environment_dictionary.set(this, {});
        this.reinit(...toConvert_parts);
    }
    static getFragmentedArgumentValue(_array, _i, start = 0) {
        let r = null;
        let i = _i;
        if (i < _array.length) {
            let symbol2pair = {
                '\"': ['\"', '\"'],
                "'": ["'", "'"],
                "(": ["(", ")"],
                "[": ["[", "]"],
                "{": ["{", "}"],
                "*": ["*", "*"],
            };
            let a0 = _array[i].substring(start, _array[i].length);
            let symbol = null;
            Object.keys(symbol2pair).forEach((_symbol) => {
                symbol = a0.startsWith(_symbol) ? _symbol : symbol;
            });
            if (typeof symbol == "string") {
                symbol = symbol;
                r = a0.substring(symbol.length, a0.length);
                for (++i; i < _array.length; ++i) {
                    r += _array[i];
                    if (_array[i].endsWith(symbol2pair[symbol][1])) {
                        r = r.substring(0, r.length - symbol2pair[symbol][1].length);
                        break;
                    }
                }
            }
            else {
                r = a0;
            }
        }
        return { i: i, content: r };
    }
    //
    reinit(...toConvert_parts) {
        let toConvert = new Array();
        toConvert_parts.forEach((toConvert_part) => {
            if (toConvert_part instanceof Object && !(toConvert_part instanceof Array)) {
                Object.keys(toConvert_part).forEach((key) => {
                    typeof toConvert_part[key] == "string" ? __classPrivateFieldGet(this, _Environment_dictionary, "f")[key] = jsontypechecker_1.JsonTypeChecker.instantiate(toConvert_part[key]) : null;
                });
            }
            else if (toConvert_part instanceof Array) {
                toConvert_part.forEach(p => {
                    toConvert.push(p);
                });
            }
        });
        for (let i = 0; i < toConvert.length; ++i) {
            let p = toConvert[i];
            if (typeof p == "string") {
                let arg_key = null;
                let arg_value = null;
                if (p.startsWith("-")) {
                    p = arg_key = p.startsWith("--") ? p.substring(2, p.length) : p.startsWith("-") ? p.substring(1, p.length) : p;
                }
                let p2 = p.split("=");
                arg_key = p2.length > 1 ? p2[0] : arg_key;
                let start = 0;
                arg_key ? p2.length <= 1 ? i + 1 < toConvert.length ? !toConvert[i + 1].startsWith("-") ? ++i : i : i : start = toConvert[i].substring(0, toConvert[i].indexOf("=") + 1).length : i;
                let f_arg_v_r = Environment.getFragmentedArgumentValue(toConvert, i, start);
                arg_value = f_arg_v_r.content ? jsontypechecker_1.JsonTypeChecker.instantiate(f_arg_v_r.content) : true;
                arg_key ? __classPrivateFieldGet(this, _Environment_dictionary, "f")[arg_key] = arg_value : !__classPrivateFieldGet(this, _Environment_dictionary, "f")[this.ARG_FIRST_COMMAND_LABEL_KEY] ? __classPrivateFieldGet(this, _Environment_dictionary, "f")[this.ARG_FIRST_COMMAND_LABEL_KEY] = p : __classPrivateFieldGet(this, _Environment_array_dictionary, "f").push(arg_value);
                i = f_arg_v_r.i;
            }
        }
    }
    //
    get(key) {
        if (!key) {
            let r = __classPrivateFieldGet(this, _Environment_array_dictionary, "f");
            Object.keys(__classPrivateFieldGet(this, _Environment_dictionary, "f")).forEach(k => {
                r[k] = __classPrivateFieldGet(this, _Environment_dictionary, "f")[k];
            });
            return r;
        }
        return typeof key == "string" ? __classPrivateFieldGet(this, _Environment_dictionary, "f")[key] : __classPrivateFieldGet(this, _Environment_array_dictionary, "f")[key];
    }
    set(key, value) {
        if (typeof key == "string") {
            __classPrivateFieldGet(this, _Environment_dictionary, "f")[key] = value;
        }
        else {
            __classPrivateFieldGet(this, _Environment_array_dictionary, "f")[key] = value;
        }
    }
    remove(key, value) {
        if (typeof key == "string") {
            if (this.has(key))
                delete __classPrivateFieldGet(this, _Environment_dictionary, "f")[key];
        }
        else {
            __classPrivateFieldSet(this, _Environment_array_dictionary, arraysutil_1.default.removeFromArray(__classPrivateFieldGet(this, _Environment_array_dictionary, "f"), key), "f");
        }
    }
    has(key) {
        return this.get(key);
    }
    keys() {
        return Object.keys(__classPrivateFieldGet(this, _Environment_dictionary, "f"));
    }
    indexes() {
        return __classPrivateFieldGet(this, _Environment_array_dictionary, "f").length;
    }
    get firstCommandLabel() { return __classPrivateFieldGet(this, _Environment_dictionary, "f")[this.ARG_FIRST_COMMAND_LABEL_KEY]; }
    //
    parse(content) {
        let r = content;
        this.keys().forEach((key) => {
            r = content.replace(new RegExp("(\$\{" + key + "\})|(\%" + key + "\%)"), this.get(key)?.toString() || "");
        });
        return r;
    }
}
exports.Environment = Environment;
_Environment_array_dictionary = new WeakMap(), _Environment_dictionary = new WeakMap();
class Command {
    constructor(options) {
        //
        _Command_label.set(this, void 0);
        _Command_help.set(this, void 0);
        _Command_callback.set(this, void 0);
        this.cli = null;
        __classPrivateFieldSet(this, _Command_label, options.label, "f");
        __classPrivateFieldSet(this, _Command_help, options.help || "", "f");
        __classPrivateFieldSet(this, _Command_callback, options.callback, "f");
    }
    static parseRawInput(input) {
        let r = {
            label: null,
            args: []
        };
        let input_args = input.split(" ");
        let cmd_env = new Environment(input_args);
        r.label = cmd_env.firstCommandLabel + "";
        r.args = cmd_env.get();
        return r;
    }
    //
    get label() { return __classPrivateFieldGet(this, _Command_label, "f"); }
    get help() { return __classPrivateFieldGet(this, _Command_help, "f"); }
    get callback() { return __classPrivateFieldGet(this, _Command_callback, "f"); }
}
exports.Command = Command;
_Command_label = new WeakMap(), _Command_help = new WeakMap(), _Command_callback = new WeakMap();
//
class CLI extends listener_class_1.Listener {
    constructor(options) {
        super();
        _CLI_env_env.set(this, void 0);
        _CLI_argv_env.set(this, void 0);
        _CLI_commands.set(this, void 0);
        _CLI_startup_message.set(this, "");
        _CLI_prefix.set(this, void 0);
        _CLI_suffix.set(this, void 0);
        _CLI_history.set(this, new Array());
        _CLI_h_i.set(this, -1);
        _CLI_tmp_line.set(this, "");
        _CLI_cursor.set(this, 0);
        _CLI_old_line_size.set(this, 0);
        _CLI_line.set(this, "");
        _CLI_closed.set(this, true);
        _CLI_print_compiled_prompt.set(this, () => {
            let compiled_line = __classPrivateFieldGet(this, _CLI_line, "f");
            let on_cursor_pos = compiled_line.substring(__classPrivateFieldGet(this, _CLI_cursor, "f"), __classPrivateFieldGet(this, _CLI_cursor, "f") + 1);
            on_cursor_pos = on_cursor_pos.length > 0 ? on_cursor_pos : " ";
            compiled_line = compiled_line.substring(0, __classPrivateFieldGet(this, _CLI_cursor, "f")) + "§f§n§l" + on_cursor_pos + "§r" + compiled_line.substring(__classPrivateFieldGet(this, _CLI_cursor, "f") + 1, compiled_line.length);
            let t = __classPrivateFieldGet(this, _CLI_cursor, "f");
            let compiled_prompt = (0, colors_1.color)("\r" + __classPrivateFieldGet(this, _CLI_prefix, "f") + "" + __classPrivateFieldGet(this, _CLI_suffix, "f") + "" + compiled_line + "");
            this.output["__write"]("\x1b[2K");
            this.output["__write"](compiled_prompt);
            this.output["__write"]("\r");
        });
        _CLI_live_stdin_data_callback.set(this, async (d, key) => {
            if (!__classPrivateFieldGet(this, _CLI_closed, "f")) {
                if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.RETURN)) {
                    let input = __classPrivateFieldGet(this, _CLI_line, "f");
                    let cmd_info = Command.parseRawInput(input);
                    this.output["__write"]("\n");
                    if (typeof cmd_info.label == "string" && cmd_info.label.length > 0) {
                        input != this.history[this.history.length - 1] ? __classPrivateFieldGet(this, _CLI_history, "f").unshift(input) : null;
                        this.history.length > 128 ? __classPrivateFieldGet(this, _CLI_history, "f").pop() : null;
                        if (this.hasCommand(cmd_info.label))
                            await this.runCommand(cmd_info.label, cmd_info.args);
                        else
                            this.output.write("Unknow command.\n");
                        this.output.write("\n");
                        __classPrivateFieldSet(this, _CLI_line, "", "f");
                        __classPrivateFieldSet(this, _CLI_cursor, 0, "f");
                    }
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.UP)
                    || vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.DOWN)) {
                    if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.UP)) {
                        __classPrivateFieldSet(this, _CLI_h_i, __classPrivateFieldGet(this, _CLI_h_i, "f") + (__classPrivateFieldGet(this, _CLI_h_i, "f") < this.history.length - 1 ? 1 : 0), "f");
                    }
                    else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.DOWN)) {
                        __classPrivateFieldSet(this, _CLI_h_i, __classPrivateFieldGet(this, _CLI_h_i, "f") + (__classPrivateFieldGet(this, _CLI_h_i, "f") > -1 ? -1 : 0), "f");
                    }
                    __classPrivateFieldSet(this, _CLI_tmp_line, __classPrivateFieldGet(this, _CLI_h_i, "f") == -1 ? __classPrivateFieldGet(this, _CLI_line, "f") : __classPrivateFieldGet(this, _CLI_tmp_line, "f"), "f");
                    __classPrivateFieldSet(this, _CLI_line, __classPrivateFieldGet(this, _CLI_h_i, "f") == -1 ? __classPrivateFieldGet(this, _CLI_tmp_line, "f") : this.history[__classPrivateFieldGet(this, _CLI_h_i, "f")], "f");
                    __classPrivateFieldSet(this, _CLI_cursor, 0, "f");
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.LEFT)) {
                    __classPrivateFieldSet(this, _CLI_cursor, __classPrivateFieldGet(this, _CLI_cursor, "f") + (__classPrivateFieldGet(this, _CLI_cursor, "f") > 0 ? -1 : 0), "f");
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.QUICK_LEFT)) {
                    __classPrivateFieldSet(this, _CLI_cursor, __classPrivateFieldGet(this, _CLI_line, "f").substring(0, __classPrivateFieldGet(this, _CLI_cursor, "f")).lastIndexOf(" "), "f");
                    __classPrivateFieldGet(this, _CLI_cursor, "f") < 0 ? __classPrivateFieldSet(this, _CLI_cursor, 0, "f") : null;
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.RIGHT)) {
                    __classPrivateFieldSet(this, _CLI_cursor, __classPrivateFieldGet(this, _CLI_cursor, "f") + (__classPrivateFieldGet(this, _CLI_cursor, "f") < __classPrivateFieldGet(this, _CLI_line, "f").length ? 1 : 0), "f");
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.QUICK_RIGHT)) {
                    __classPrivateFieldSet(this, _CLI_cursor, __classPrivateFieldGet(this, _CLI_line, "f").substring(0, __classPrivateFieldGet(this, _CLI_cursor, "f") + 1).length + __classPrivateFieldGet(this, _CLI_line, "f").substring(__classPrivateFieldGet(this, _CLI_cursor, "f") + 1, __classPrivateFieldGet(this, _CLI_line, "f").length).indexOf(" "), "f");
                    __classPrivateFieldGet(this, _CLI_line, "f").substring(__classPrivateFieldGet(this, _CLI_cursor, "f") + 1, __classPrivateFieldGet(this, _CLI_line, "f").length).indexOf(" ") < 0 ? __classPrivateFieldSet(this, _CLI_cursor, __classPrivateFieldGet(this, _CLI_line, "f").length, "f") : null;
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.HOME)) {
                    __classPrivateFieldSet(this, _CLI_cursor, 0, "f");
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.END)) {
                    __classPrivateFieldSet(this, _CLI_cursor, __classPrivateFieldGet(this, _CLI_line, "f").length, "f");
                }
                else if (vkb_1.VirtualKeyBoard.is(key, vkb_1.VirtualKeyBoard.KEYS.INTERACTIONS.TERMINAL.ESCAPE)) {
                    __classPrivateFieldSet(this, _CLI_line, "", "f");
                    __classPrivateFieldSet(this, _CLI_cursor, 0, "f");
                }
                else if (key.ctrl && key.name == "c") {
                    this.runCommand("exit");
                }
                else {
                    __classPrivateFieldSet(this, _CLI_old_line_size, __classPrivateFieldGet(this, _CLI_line, "f").length, "f");
                    let r = vkb_1.VirtualKeyBoard.parse(__classPrivateFieldGet(this, _CLI_line, "f"), key, __classPrivateFieldGet(this, _CLI_cursor, "f"));
                    __classPrivateFieldSet(this, _CLI_line, r.line, "f");
                    __classPrivateFieldSet(this, _CLI_cursor, r.index, "f");
                }
                __classPrivateFieldGet(this, _CLI_print_compiled_prompt, "f").call(this);
            }
        });
        //
        this.log = (...args) => {
            this.print({ prefix: createLogPrefix("§eLOG"), args: args });
        };
        this.info = (...args) => {
            this.print({ prefix: createLogPrefix("§9INFO"), args: args });
        };
        this.warn = (...args) => {
            this.print({ prefix: createLogPrefix("§6WARN"), args: args });
        };
        this.error = (...args) => {
            this.print({ prefix: createLogPrefix("§4ERROR"), args: args });
        };
        //
        options = options || {};
        options.env = options.env || process.env;
        options.argv = options.argv || process.argv;
        options.prefix = options.prefix || "";
        options.suffix = options.suffix || "> ";
        options.input = options.input || process.stdin;
        options.output = options.output || process.stdout;
        //
        __classPrivateFieldSet(this, _CLI_env_env, new Environment(options.env), "f");
        __classPrivateFieldSet(this, _CLI_argv_env, new Environment(options.argv), "f");
        __classPrivateFieldSet(this, _CLI_commands, new Array(), "f");
        __classPrivateFieldSet(this, _CLI_prefix, options.prefix, "f");
        __classPrivateFieldSet(this, _CLI_suffix, options.suffix, "f");
        this.input = options.input;
        this.output = options.output;
        //
        Object.keys(DEFAULT_COMMANDS).forEach(ck => {
            this.registerCommand(DEFAULT_COMMANDS[ck]);
        });
    }
    //
    get env() {
        return __classPrivateFieldGet(this, _CLI_env_env, "f");
    }
    get argv() {
        return __classPrivateFieldGet(this, _CLI_argv_env, "f");
    }
    get prefix() { return __classPrivateFieldGet(this, _CLI_prefix, "f"); }
    set prefix(prefix) { __classPrivateFieldSet(this, _CLI_prefix, prefix, "f"); }
    get suffix() { return __classPrivateFieldGet(this, _CLI_suffix, "f"); }
    set suffix(suffix) { __classPrivateFieldSet(this, _CLI_suffix, suffix, "f"); }
    get history() {
        return __classPrivateFieldGet(this, _CLI_history, "f");
    }
    get live_stdin_data_callback() {
        return __classPrivateFieldGet(this, _CLI_live_stdin_data_callback, "f");
    }
    //
    setStartupMessage(message) {
        __classPrivateFieldSet(this, _CLI_startup_message, message, "f");
    }
    //
    async first() {
        this.bindConsole();
        //
        let cmd_info = {
            label: null,
            args: []
        };
        let cmd_env = this.argv;
        if (this.argv.indexes() > 1) {
            console.log(cmd_env.keys());
            console.log(cmd_env.get());
            cmd_info.args = cmd_env.get();
            cmd_info.args.shift();
            console.log(cmd_info.args);
            cmd_info.label = cmd_info.args.shift();
            console.log(cmd_info.args);
            let success = await this.runCommand(cmd_info.label, cmd_info.args);
            !success ? await this.runCommand("help", cmd_info.label) : null;
        }
        else {
            await this.runCommand("help");
        }
        //
        this.unbindConsole();
    }
    live() {
        this.output["__write"] = this.output.write;
        this.output["write"] = (...args) => {
            this.output["__write"]("\x1b[2K");
            this.output["__write"](...args);
            __classPrivateFieldGet(this, _CLI_print_compiled_prompt, "f").call(this);
        };
        this.bindConsole();
        readline.emitKeypressEvents(this.input);
        this.input.setRawMode(true);
        this.input.on("keypress", this.live_stdin_data_callback);
        __classPrivateFieldGet(this, _CLI_startup_message, "f").length > 0 ? console.log(__classPrivateFieldGet(this, _CLI_startup_message, "f")) : null;
        __classPrivateFieldSet(this, _CLI_closed, false, "f");
        __classPrivateFieldGet(this, _CLI_print_compiled_prompt, "f").call(this);
    }
    close() {
        __classPrivateFieldSet(this, _CLI_closed, true, "f");
        this.output["write"] = this.output["__write"];
        this.output["__write"] = undefined;
        this.unbindConsole();
        this.input.removeListener("keypress", this.live_stdin_data_callback);
        this.input.setRawMode(false);
    }
    //
    registerCommand(command) {
        let _command = command instanceof Command ? command : new Command(command);
        this.unregisterCommand(_command.label);
        _command.cli = this;
        __classPrivateFieldGet(this, _CLI_commands, "f").push(_command);
    }
    unregisterCommand(command) {
        let _command = this.getCommand(command);
        if (_command) {
            __classPrivateFieldSet(this, _CLI_commands, arraysutil_1.default.removeFromArray(__classPrivateFieldGet(this, _CLI_commands, "f"), __classPrivateFieldGet(this, _CLI_commands, "f").indexOf(_command)), "f");
        }
    }
    getCommand(command) {
        let r = null;
        if (command instanceof Command) {
            r = __classPrivateFieldGet(this, _CLI_commands, "f").includes(command) ? __classPrivateFieldGet(this, _CLI_commands, "f")[__classPrivateFieldGet(this, _CLI_commands, "f").indexOf(command)] : r;
        }
        else {
            for (let i = 0; i < __classPrivateFieldGet(this, _CLI_commands, "f").length; ++i) {
                if (__classPrivateFieldGet(this, _CLI_commands, "f")[i].label == command) {
                    r = __classPrivateFieldGet(this, _CLI_commands, "f")[i];
                    break;
                }
            }
        }
        return r;
    }
    hasCommand(command) {
        return this.getCommand(command) ? true : false;
    }
    getCommands() {
        return __classPrivateFieldGet(this, _CLI_commands, "f");
    }
    //
    async runCommand(label, ...args) {
        try {
            return this.hasCommand(label) ? await this.getCommand(label)?.callback(label, args.length == 1 ? args[0] instanceof Array ? args[0] : args : args, this) : false;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    print(options) {
        options.prefix ? options.args.unshift(options.prefix) : null;
        options.suffix ? options.args.push(options.suffix) : null;
        for (let i = 0; i < options.args.length; ++i) {
            typeof options.args[i] == "string" ? options.args[i] = (0, colors_1.color)(options.args[i]) : null;
        }
        console["__log"](...options.args);
    }
    bindConsole() {
        let console_methods_to_bind = ["log", "info", "warn", "error"];
        for (let i = 0; i < console_methods_to_bind.length; ++i) {
            console["__" + console_methods_to_bind[i]] = console[console_methods_to_bind[i]];
            console[console_methods_to_bind[i]] = this[console_methods_to_bind[i]];
        }
    }
    unbindConsole() {
        let console_methods_to_unbind = ["log", "info", "warn", "error"];
        for (let i = 0; i < console_methods_to_unbind.length; ++i) {
            console[console_methods_to_unbind[i]] = console["__" + console_methods_to_unbind[i]];
            console["__" + console_methods_to_unbind[i]] = undefined;
        }
    }
}
exports.CLI = CLI;
_CLI_env_env = new WeakMap(), _CLI_argv_env = new WeakMap(), _CLI_commands = new WeakMap(), _CLI_startup_message = new WeakMap(), _CLI_prefix = new WeakMap(), _CLI_suffix = new WeakMap(), _CLI_history = new WeakMap(), _CLI_h_i = new WeakMap(), _CLI_tmp_line = new WeakMap(), _CLI_cursor = new WeakMap(), _CLI_old_line_size = new WeakMap(), _CLI_line = new WeakMap(), _CLI_closed = new WeakMap(), _CLI_print_compiled_prompt = new WeakMap(), _CLI_live_stdin_data_callback = new WeakMap();
function createLogPrefix(name) {
    let d = new Date();
    return "[" + name + "§r - §8"
        + d.getDate() + "/"
        + (d.getMonth() + 1) + "/"
        + d.getFullYear() + " at "
        + (d.getHours() < 10 ? "0" : "") + d.getHours() + ":"
        + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":"
        + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds() + ","
        + (d.getMilliseconds() < 10 ? "00" : d.getMilliseconds() < 100 ? "0" : "") + d.getMilliseconds()
        + "§r]";
}
