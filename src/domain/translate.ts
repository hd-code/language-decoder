import { Language } from "./Language";

export type translate = (
    word: string,
    from: Language,
    to: Language,
) => Promise<string[]>;
