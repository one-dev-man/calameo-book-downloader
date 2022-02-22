import * as readline from "readline";
import { Interface as ReadlineInterfance } from "readline";

import { Listener } from "../utils/listener.class";
import ArraysUtil from "../utils/arraysutil";

import { JsonTypeChecker, TYPES } from "../utils/jsontypechecker";
import { color } from "./colors";
import { VirtualKeyBoard as VKB } from "./vkb";

// DEFAULT COMMANDS :

const DEFAULT_COMMANDS = {
    exit: {
        label: "exit",
        help: "exit - Exit the program.",
        callback: async (label: string, args: Array<any>, cli: CLI) => {
            process.exit(0);
            // return true;
        }
    },
    help: {
        label: "help",
        help: "[<command>] - Show commands usage or specific command usage.",
        callback: async (label: string, args: Array<any>, cli: CLI) => {
            if(args.length < 1) {
                let cmds = cli.getCommands();
                console["__log"]("Commands usage :");
                for(let i = 0; i < cmds.length; ++i) {
                    let cmd = cmds[i];
                    console["__log"](" - "+cmd.label+" : "+cmd.help);
                }
            }
            else {
                if(cli.hasCommand(args[0])) {
                    let cmd = cli.getCommand(args[0]) as Command;
                    console["__log"]("Command usage :");
                    console["__log"](" - "+cmd.label+" : "+cmd.help);
                }
                else {
                    console["__log"]("Command \""+args[0]+"\" not found.");
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

export class Environment {

    static getFragmentedArgumentValue(_array: Array<string>, _i: number, start: number = 0) {
        let r: string | null = null;
        let i = _i;
        if(i < _array.length) {
            let symbol2pair: {[key: string]: Array<string>} = {
                '\"': ['\"', '\"'],
                "'": ["'", "'"],
                "(": ["(", ")"],
                "[": ["[", "]"],
                "{": ["{", "}"],
                "*": ["*", "*"],
            }
    
            let a0 = _array[i].substring(start, _array[i].length);
            let symbol: string | null = null;
            Object.keys(symbol2pair).forEach((_symbol: string) => {
                symbol = a0.startsWith(_symbol) ? _symbol : symbol;
            });
            if(typeof symbol == "string") {
                symbol = (symbol as string);
                r = a0.substring(symbol.length, a0.length);
                for(++i ; i < _array.length; ++i) {
                    r+=_array[i];
                    if(_array[i].endsWith(symbol2pair[symbol][1])) {
                        r = r.substring(0, r.length-symbol2pair[symbol][1].length);
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

    ARG_FIRST_COMMAND_LABEL_KEY = "AFCL_"+Date.now();

    #array_dictionary = new Array<TYPES>();
    #dictionary: {[key: string]: TYPES} = {};

    constructor(...toConvert_parts: Array<any>) {
        this.reinit(...toConvert_parts);
    }

    //

    reinit(...toConvert_parts: Array<any>) {
        let toConvert = new Array<any>();
        
        toConvert_parts.forEach((toConvert_part) => {
            if(toConvert_part instanceof Object && !(toConvert_part instanceof Array)) {
                Object.keys(toConvert_part).forEach((key: string) => {
                    typeof toConvert_part[key] == "string" ? this.#dictionary[key] = JsonTypeChecker.instantiate(toConvert_part[key]) : null;
                });
            }
            else if(toConvert_part instanceof Array) {
                toConvert_part.forEach(p => {
                    toConvert.push(p);
                })
            }
        });

        for(let i = 0; i < toConvert.length; ++i) {
            let p = toConvert[i];
            if(typeof p == "string") {
                let arg_key: string | null = null;
                let arg_value: any = null;

                if(p.startsWith("-")) {
                    p = arg_key = p.startsWith("--") ? p.substring(2, p.length) : p.startsWith("-") ? p.substring(1, p.length) : p;
                }

                let p2 = p.split("=") as Array<string>;

                arg_key = p2.length > 1 ? p2[0] as string : arg_key;
                let start = 0;
                arg_key ? p2.length <= 1 ? i+1 < toConvert.length ? !(toConvert[i+1] as string).startsWith("-") ? ++i : i : i : start = (toConvert[i] as string).substring(0, (toConvert[i] as string).indexOf("=")+1).length : i;

                let f_arg_v_r = Environment.getFragmentedArgumentValue(toConvert, i, start);

                arg_value = f_arg_v_r.content ? JsonTypeChecker.instantiate(f_arg_v_r.content) : true;
                arg_key ? this.#dictionary[arg_key] = arg_value : !this.#dictionary[this.ARG_FIRST_COMMAND_LABEL_KEY] ? this.#dictionary[this.ARG_FIRST_COMMAND_LABEL_KEY] = p : this.#array_dictionary.push(arg_value);
                
                i = f_arg_v_r.i;
            }
        }
    }

    //

    get(key: string | number | void) {
        if(!key) {
            let r = this.#array_dictionary;
            Object.keys(this.#dictionary).forEach(k => {
                r[k] = this.#dictionary[k];
            })
            return r;
        }
        return typeof key == "string" ? this.#dictionary[key] : this.#array_dictionary[key];
    }

    set(key: string | number, value: any) {
        if(typeof key == "string") {
            this.#dictionary[key] = value;
        }
        else {
            this.#array_dictionary[key] = value;
        }
    }

    remove(key: string | number, value: any) {
        if(typeof key == "string") {
            if(this.has(key)) delete this.#dictionary[key];
        }
        else {
            this.#array_dictionary = ArraysUtil.removeFromArray(this.#array_dictionary, key);
        }
    }

    has(key: string | number) {
        return this.get(key);
    }

    keys() {
        return Object.keys(this.#dictionary);
    }

    indexes() {
        return this.#array_dictionary.length;
    }

    get firstCommandLabel() { return this.#dictionary[this.ARG_FIRST_COMMAND_LABEL_KEY]; }

    //

    parse(content: string) {
        let r = content;
        this.keys().forEach((key: string) => {
            r = content.replace(new RegExp("(\$\{"+key+"\})|(\%"+key+"\%)"), this.get(key)?.toString() || "");
        });
        return r;
    }
}

//

export type CLI_COMMAND_CALLBACK_TYPE = (label: string, args: Array<any>, cli: CLI | any) => Promise<boolean>;
export type CLI_COMMAND_CONSTRUCTOR_TYPE = { label: string, help?: string, callback: CLI_COMMAND_CALLBACK_TYPE };

export class Command {

    static parseRawInput(input: string): { label: string | null, args: Array<any> } {
        let r: { label: string | null, args: Array<any> } = {
            label: null,
            args: []
        }

        let input_args = input.split(" ");
        let cmd_env = new Environment(input_args);

        r.label = cmd_env.firstCommandLabel+"";
        r.args = cmd_env.get() as any;

        return r;
    }

    //

    #label: string;
    #help: string;
    #callback: CLI_COMMAND_CALLBACK_TYPE;

    cli: CLI | null = null;

    constructor(options: CLI_COMMAND_CONSTRUCTOR_TYPE) {
        this.#label = options.label;
        this.#help = options.help || "";
        this.#callback = options.callback;
    }

    //

    get label() { return this.#label; }

    get help() { return this.#help; }

    get callback() { return this.#callback; }

    //

}

//

export class CLI extends Listener {
    #env_env: Environment;
    #argv_env: Environment;

    #commands: Array<Command>;

    #startup_message: string = "";
    #prefix: string;
    #suffix: string;

    #history = new Array<string>();
    #h_i: number = -1;
    #tmp_line: string = "";

    #cursor: number = 0;

    #old_line_size = 0;
    #line: string = "";

    #closed = true;

    input: any;
    output: any;

    #print_compiled_prompt = () => {
        let compiled_line = this.#line;
        let on_cursor_pos = compiled_line.substring(this.#cursor, this.#cursor+1);
        on_cursor_pos = on_cursor_pos.length > 0 ? on_cursor_pos : " ";
        compiled_line = compiled_line.substring(0, this.#cursor)+"§f§n§l"+on_cursor_pos+"§r"+compiled_line.substring(this.#cursor+1, compiled_line.length);

        let t = this.#cursor;
        let compiled_prompt = color("\r"+this.#prefix+""+this.#suffix+""+compiled_line+"");
        this.output["__write"]("\x1b[2K")
        this.output["__write"](compiled_prompt);
        this.output["__write"]("\r");
    }

    #live_stdin_data_callback = async (d: any, key: { sequence?: string, name?: string, ctrl?: boolean, meta?: boolean, shift?: boolean, code?: string }) => {
        if(!this.#closed) {
            if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.RETURN)) {
                let input = this.#line;
                let cmd_info = Command.parseRawInput(input);
                this.output["__write"]("\n");
        
                if(typeof cmd_info.label == "string" && cmd_info.label.length > 0) {
                    input != this.history[this.history.length-1] ? this.#history.unshift(input) : null;
                    this.history.length > 128 ? this.#history.pop() : null;
                    if(this.hasCommand(cmd_info.label)) await this.runCommand(cmd_info.label, cmd_info.args);
                    else this.output.write("Unknow command.\n");
                    this.output.write("\n");
                    this.#line = "";
                    this.#cursor = 0;
                }
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.UP)
                    || VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.DOWN)) {
                if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.UP)) {
                    this.#h_i += this.#h_i < this.history.length-1 ? 1 : 0;
                }
                else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.DOWN)) {
                    this.#h_i += this.#h_i > -1 ? -1 : 0;
                }
                
                this.#tmp_line = this.#h_i == -1 ? this.#line : this.#tmp_line;
                this.#line = this.#h_i == -1 ? this.#tmp_line : this.history[this.#h_i];
                this.#cursor = 0;
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.LEFT)) {
                this.#cursor += this.#cursor > 0 ? -1 : 0;
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.QUICK_LEFT)) {
                this.#cursor = this.#line.substring(0, this.#cursor).lastIndexOf(" ");
                this.#cursor < 0 ? this.#cursor = 0 : null;
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.RIGHT)) {
                this.#cursor += this.#cursor < this.#line.length ? 1 : 0;
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.QUICK_RIGHT)) {
                this.#cursor = this.#line.substring(0, this.#cursor+1).length + this.#line.substring(this.#cursor+1, this.#line.length).indexOf(" ");
                this.#line.substring(this.#cursor+1, this.#line.length).indexOf(" ") < 0 ? this.#cursor = this.#line.length : null;
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.HOME)) {
                this.#cursor = 0;
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.END)) {
                this.#cursor = this.#line.length;
            }
            else if(VKB.is(key, VKB.KEYS.INTERACTIONS.TERMINAL.ESCAPE)) {
                this.#line = "";
                this.#cursor = 0;
            }
            else if(key.ctrl && key.name == "c") {
                this.runCommand("exit");
            }
            else {
                this.#old_line_size = this.#line.length;
                let r = VKB.parse(this.#line, key, this.#cursor);
                this.#line = r.line;
                this.#cursor = r.index;
            }
            this.#print_compiled_prompt();
        }
    };

    constructor(options?: { env?: any, argv?: any, prefix?: string, suffix?: string, input?: any, output?: any }) {
        super();

        //

        options = options || {};

        options.env = options.env || process.env;
        options.argv = options.argv || process.argv;
        options.prefix = options.prefix || "";
        options.suffix = options.suffix || "> ";
        options.input = options.input || process.stdin;
        options.output = options.output || process.stdout;

        //

        this.#env_env = new Environment(options.env);
        this.#argv_env = new Environment(options.argv);
        this.#commands = new Array<Command>();

        this.#prefix = options.prefix;
        this.#suffix = options.suffix;

        this.input = options.input;
        this.output = options.output;

        //

        Object.keys(DEFAULT_COMMANDS).forEach(ck => {
            this.registerCommand(DEFAULT_COMMANDS[ck]);
        });
    }

    //

    get env() {
        return this.#env_env
    }

    get argv() {
        return this.#argv_env;
    }

    get prefix() { return this.#prefix; }

    set prefix(prefix: string) { this.#prefix = prefix; }

    get suffix() { return this.#suffix; }

    set suffix(suffix: string) { this.#suffix = suffix; }

    get history() {
        return this.#history;
    }

    get live_stdin_data_callback() {
        return this.#live_stdin_data_callback;
    }

    //

    setStartupMessage(message: string) {
        this.#startup_message = message;
    }

    //

    async first() {
        this.bindConsole();

        //

        let cmd_info: { label: string | null, args: Array<any> } = {
            label: null,
            args: []
        }

        let cmd_env = this.argv;

        if(this.argv.indexes() > 1) {
            cmd_info.args = cmd_env.get() as any;
            cmd_info.args.shift();
            cmd_info.label = cmd_info.args.shift() as string;

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
        this.output["write"] = (...args: Array<any>) => {
            this.output["__write"]("\x1b[2K");
            this.output["__write"](...args);
            this.#print_compiled_prompt();
        }
        
        this.bindConsole();

        readline.emitKeypressEvents(this.input);
        this.input.setRawMode(true);
        this.input.on("keypress", this.live_stdin_data_callback);
        this.#startup_message.length > 0 ? console.log(this.#startup_message) : null;

        this.#closed = false;

        this.#print_compiled_prompt();
    }

    close() {
        this.#closed = true;

        this.output["write"] = this.output["__write"];
        this.output["__write"] = undefined;

        this.unbindConsole();

        this.input.removeListener("keypress", this.live_stdin_data_callback);
        this.input.setRawMode(false);
    }

    //

    registerCommand(command: Command | CLI_COMMAND_CONSTRUCTOR_TYPE) {
        let _command = command instanceof Command ? command : new Command(command);
        this.unregisterCommand(_command.label);
        _command.cli = this;
        this.#commands.push(_command);
    }

    unregisterCommand(command: Command | string) {
        let _command: Command | null = this.getCommand(command);
        if(_command) {
            this.#commands = ArraysUtil.removeFromArray(this.#commands, this.#commands.indexOf(_command));
        }
    }

    getCommand(command: Command | string): Command | null {
        let r: Command | null = null;
        if(command instanceof Command) {
            r = this.#commands.includes(command) ? this.#commands[this.#commands.indexOf(command)] : r;
        }
        else {
            for(let i = 0; i < this.#commands.length; ++i) {
                if(this.#commands[i].label == command) { r = this.#commands[i]; break; }
            }
        }
        return r;
    }

    hasCommand(command: Command | string) {
        return this.getCommand(command) ? true : false;
    }

    getCommands() {
        return this.#commands;
    }

    //

    async runCommand(label: string, ...args: Array<any>): Promise<boolean> {
        try {
            return this.hasCommand(label) ? await this.getCommand(label)?.callback(label, args.length == 1 ? args[0] instanceof Array ? args[0] : args : args, this) as boolean : false;
        } catch(e) {
            console.error(e);
            return false;
        }
    }

    //

    log = (...args: Array<any>) => {
        this.print({ prefix: createLogPrefix("§eLOG"), args: args });
    }

    info = (...args: Array<any>) => {
        this.print({ prefix: createLogPrefix("§9INFO"), args: args });
    }

    warn = (...args: Array<any>) => {
        this.print({ prefix: createLogPrefix("§6WARN"), args: args });
    }

    error = (...args: Array<any>) => {
        this.print({ prefix: createLogPrefix("§4ERROR"), args: args });
    }

    print(options: { prefix?: string | null, suffix?: string | null, args: Array<any> }) {
        options.prefix ? options.args.unshift(options.prefix) : null;
        options.suffix ? options.args.push(options.suffix) : null;
        for(let i = 0; i < options.args.length; ++i) {
            typeof options.args[i] == "string" ? options.args[i] = color(options.args[i]) : null;
        }
        console["__log"](...options.args);
    }

    bindConsole() {
        let console_methods_to_bind = ["log", "info", "warn", "error"];
        for(let i = 0; i < console_methods_to_bind.length; ++i) {
            console["__"+console_methods_to_bind[i]] = console[console_methods_to_bind[i]];
            console[console_methods_to_bind[i]] = this[console_methods_to_bind[i]];
        }
    }

    unbindConsole() {
        let console_methods_to_unbind = ["log", "info", "warn", "error"];
        for(let i = 0; i < console_methods_to_unbind.length; ++i) {
            console[console_methods_to_unbind[i]] = console["__"+console_methods_to_unbind[i]];
            console["__"+console_methods_to_unbind[i]] = undefined;
        }
    }

}

function createLogPrefix(name: string) {
    let d = new Date();
    return "["+name+"§r - §8"
    +d.getDate()+"/"
    +(d.getMonth()+1)+"/"
    +d.getFullYear()+" at "
    +(d.getHours() < 10 ? "0" : "")+d.getHours()+":"
    +(d.getMinutes() < 10 ? "0" : "")+d.getMinutes()+":"
    +(d.getSeconds() < 10 ? "0" : "")+d.getSeconds()+","
    +(d.getMilliseconds() < 10 ? "00" : d.getMilliseconds() < 100 ? "0" : "")+d.getMilliseconds()
    +"§r]";
}