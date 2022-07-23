import * as React from "react";

import { Language, Text, sampleText } from "../domain";

import {
    EditTranslationScreen,
    InputTextScreen,
    ShowTextScreen,
} from "./screens";

export const App: React.FC = () => {
    const api = window.api;

    const [text, setText] = React.useState<Text | null>(sampleText);
    const [lang, setLang] = React.useState<Language>(Language.german);
    const [edit, setEdit] = React.useState(false);

    const onCreateText = (t: Text, l: Language) => {
        setText(t);
        setLang(l);
    };

    return text === null ? (
        <InputTextScreen {...{ api, onCreateText }} />
    ) : edit ? (
        <EditTranslationScreen {...{ api, text, setText, lang, setEdit }} />
    ) : (
        <ShowTextScreen {...{ api, text, lang, setLang, setEdit }} />
    );
};
