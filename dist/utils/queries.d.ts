declare const queries: {
    get(_href_: string): {
        "#": {};
        "?": {};
        from: string;
    };
    clear(_queries: {
        "#": {};
        "?": {};
        from: string;
    }): {
        "#": {};
        "?": {};
        from: string;
    };
    href: (_queries: {
        "#": {};
        "?": {};
        from: string;
    }) => string;
};
export default queries;
