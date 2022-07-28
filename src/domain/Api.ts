import { Language } from "./Language";
import { Text } from "./Text";

export interface Api {
    translate: (
        word: string,
        from: Language,
        to: Language,
    ) => Promise<string[]>;

    saveText: (text: Text) => Promise<Error|null>;
    loadText: () => Promise<Text>;
}
