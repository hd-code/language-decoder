import { hasKey, isObject, isString } from "../../lib/type-guards";
import { Language, isLanguage } from "./Language";

// -----------------------------------------------------------------------------

export type Text = {
    author?: string;
    language: Language;
    text: string; // 0th line is the title
    translations: { [lang in Language]?: string[][] };
};

export function isText(text: unknown): text is Text {
    return (
        hasKey(text, "language", isLanguage) &&
        hasKey(text, "text", isString) &&
        hasKey(text, "translations", isObject) &&
        (!hasKey(text, "author") || hasKey(text, "author", isString)) &&
        checkTranslations(text)
    );
}

function checkTranslations(text: Text): boolean {
    if (Object.keys(text.translations).length === 0) return false;

    const wordsPerLine = tokenize(text.text).map((line) => line.length);
    for (const lang in text.translations) {
        const trans = text.translations[lang as Language];
        if (wordsPerLine.length !== trans.length) return false;
        for (let i = 0, ie = wordsPerLine.length; i < ie; i++) {
            if (wordsPerLine[i] !== trans[i].length) return false;
        }
    }

    return true;
}

// -----------------------------------------------------------------------------

export function tokenize(
    text: string,
    stripPunctuation = false,
    lowercase = false,
): string[][] {
    let tokens = text.split("\n").map((line) => line.split(" "));

    if (stripPunctuation) {
        tokens = tokens.map((line) => line.map((token) => stripPunct(token)));
    }

    if (lowercase) {
        tokens = tokens.map((line) => line.map((token) => token.toLowerCase()));
    }

    return tokens;
}

const specialChars = "!\"§$%&/()=?¿;:,.-_–'#*+<>^° \n";

function stripPunct(word: string): string {
    let i = 0;
    let j = word.length;

    while (specialChars.indexOf(word[i]) != -1) {
        i++;
    }
    while (specialChars.indexOf(word[j - 1]) != -1) {
        j--;
    }

    return word.slice(i, j);
}
