import { Listener } from "../utils/listener.class";
import { TYPES } from "../utils/jsontypechecker";
export declare class Environment {
    #private;
    static getFragmentedArgumentValue(_array: Array<string>, _i: number, start?: number): {
        i: number;
        content: string | null;
    };
    ARG_FIRST_COMMAND_LABEL_KEY: string;
    constructor(...toConvert_parts: Array<any>);
    reinit(...toConvert_parts: Array<any>): void;
    get(key: string | number | void): TYPES;
    set(key: string | number, value: any): void;
    remove(key: string | number, value: any): void;
    has(key: string | number): TYPES;
    keys(): string[];
    indexes(): number;
    get firstCommandLabel(): TYPES;
    parse(content: string): string;
}
export declare type CLI_COMMAND_CALLBACK_TYPE = (label: string, args: Array<any>, cli: CLI | any) => Promise<boolean>;
export declare type CLI_COMMAND_CONSTRUCTOR_TYPE = {
    label: string;
    help?: string;
    callback: CLI_COMMAND_CALLBACK_TYPE;
};
export declare class Command {
    #private;
    static parseRawInput(input: string): {
        label: string | null;
        args: Array<any>;
    };
    cli: CLI | null;
    constructor(options: CLI_COMMAND_CONSTRUCTOR_TYPE);
    get label(): string;
    get help(): string;
    get callback(): CLI_COMMAND_CALLBACK_TYPE;
}
export declare class CLI extends Listener {
    #private;
    input: any;
    output: any;
    constructor(options?: {
        env?: any;
        argv?: any;
        prefix?: string;
        suffix?: string;
        input?: any;
        output?: any;
    });
    get env(): Environment;
    get argv(): Environment;
    get prefix(): string;
    set prefix(prefix: string);
    get suffix(): string;
    set suffix(suffix: string);
    get history(): string[];
    get live_stdin_data_callback(): (d: any, key: {
        sequence?: string | undefined;
        name?: string | undefined;
        ctrl?: boolean | undefined;
        meta?: boolean | undefined;
        shift?: boolean | undefined;
        code?: string | undefined;
    }) => Promise<void>;
    setStartupMessage(message: string): void;
    first(): Promise<void>;
    live(): void;
    close(): void;
    registerCommand(command: Command | CLI_COMMAND_CONSTRUCTOR_TYPE): void;
    unregisterCommand(command: Command | string): void;
    getCommand(command: Command | string): Command | null;
    hasCommand(command: Command | string): boolean;
    getCommands(): Command[];
    runCommand(label: string, ...args: Array<any>): Promise<boolean>;
    log: (...args: Array<any>) => void;
    info: (...args: Array<any>) => void;
    warn: (...args: Array<any>) => void;
    error: (...args: Array<any>) => void;
    print(options: {
        prefix?: string | null;
        suffix?: string | null;
        args: Array<any>;
    }): void;
    bindConsole(): void;
    unbindConsole(): void;
}
