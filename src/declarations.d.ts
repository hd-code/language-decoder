declare module "dictcc-js" {
    function translate(
        from: string,
        to: string,
        term: string,
        cb: (res: string[], err?: Error) => void,
    );
}
