import { Language } from "./Language";

// -----------------------------------------------------------------------------

export type Text = {
    author?: string;
    language: Language;
    text: string; // 0th line is the title
    translations: { [lang in Language]?: string[][] };
};

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
