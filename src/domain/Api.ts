import { Language } from "./Language";

export interface Api {
    translate: (
        word: string,
        from: Language,
        to: Language,
    ) => Promise<string[]>;
}
