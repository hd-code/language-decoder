export enum Language {
    english = "en",
    french = "fr",
    german = "de",
    italian = "it",
    spanish = "es",
}

export const languageLabels: { [lang in Language]: string } = {
    [Language.english]: "english",
    [Language.french]: "français",
    [Language.german]: "deutsch",
    [Language.italian]: "italiano",
    [Language.spanish]: "español",
};

export const languageLabelsEnglish: { [lang in Language]: string } = {
    [Language.english]: "english",
    [Language.french]: "french",
    [Language.german]: "german",
    [Language.italian]: "italian",
    [Language.spanish]: "spanish",
};
