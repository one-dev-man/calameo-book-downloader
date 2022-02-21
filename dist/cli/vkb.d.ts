export declare class VirtualKeyBoard {
    static KEYS: {
        INTERACTIONS: {
            TEXT: {
                TAB: {
                    name: string;
                    execute: (str: string, index: number) => {
                        line: string;
                        index: number;
                    };
                };
                BACKSPACE: {
                    name: string;
                    execute: (str: string, index: number) => {
                        line: string;
                        index: number;
                    };
                };
                LARGE_BACKSPACE: {
                    name: string;
                    ctrl: boolean;
                    execute: (str: string, index: number) => {
                        line: string;
                        index: number;
                    };
                };
                DELETE: {
                    name: string;
                    execute: (str: string, index: number) => {
                        line: string;
                        index: number;
                    };
                };
                LAGE_DELETE: {
                    name: string;
                    meta: boolean;
                    execute: (str: string, index: number) => {
                        line: string;
                        index: number;
                    };
                };
                NEW_LINE: {
                    name: string;
                    meta: boolean;
                    execute: (str: string, index: number) => {
                        line: string;
                        index: number;
                    };
                };
            };
            TERMINAL: {
                EXIT: {
                    name: string;
                    ctrl: boolean;
                };
                RETURN: {
                    name: string;
                };
                UP: {
                    name: string;
                };
                DOWN: {
                    name: string;
                };
                LEFT: {
                    name: string;
                };
                QUICK_LEFT: {
                    name: string;
                    ctrl: boolean;
                };
                RIGHT: {
                    name: string;
                };
                QUICK_RIGHT: {
                    name: string;
                    ctrl: boolean;
                };
                HOME: {
                    name: string;
                };
                END: {
                    name: string;
                };
                ESCAPE: {
                    name: string;
                    meta: boolean;
                };
            };
        };
    };
    static is(key: {
        sequence?: string;
        name?: string;
        ctrl?: boolean;
        meta?: boolean;
        shift?: boolean;
        code?: string;
    }, v_key: {
        sequence?: string;
        name?: string;
        ctrl?: boolean;
        meta?: boolean;
        shift?: boolean;
        code?: string;
    }): boolean;
    static parse(str: string, key: {
        sequence?: string;
        name?: string;
        ctrl?: boolean;
        meta?: boolean;
        shift?: boolean;
        code?: string;
    }, index?: number): any;
}
