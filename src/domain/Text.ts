import { Language } from "./Language";

// import { hasKey, isEnum, isObject, isString } from "../util/typeguards";

// -----------------------------------------------------------------------------

export type Text = {
    author?: string;
    language: Language;
    text: string; // 0th line is the title
    translations: { [lang in Language]?: string[][] };
};

// TODO: check nested structures
// export function isText(t: unknown): t is Text {
//     return (
//         // @ts-ignore
//         hasKey(t, "language", (lang: unknown) => isEnum(lang, Language)) &&
//         hasKey(t, "title", isString) &&
//         hasKey(t, "text", isString) &&
//         hasKey(t, "translations", isObject)
//     );
// }

export function getTokens(t: Text): string[] {
    const tokens = tokenize(t.text, true, true).flat();
    const tokenMap: { [token: string]: boolean } = {};
    tokens.forEach((token) => {
        tokenMap[token] = true;
    });
    return Object.keys(tokenMap);
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
