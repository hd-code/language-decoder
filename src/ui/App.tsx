import * as React from "react";

import { Language } from "../domain/Language";
import { Text, sampleText } from "../domain/Text";

import {
    EditTranslationScreen,
    InputTextScreen,
    ShowTextScreen,
} from "./screens";

export const App: React.FC = () => {
    const [text, setText] = React.useState<Text | null>(sampleText);
    const [lang, setLang] = React.useState<Language>(Language.german);
    const [edit, setEdit] = React.useState(false);

    const onCreateText = (t: Text, l: Language) => {
        setText(t);
        setLang(l);
    };

    return text === null ? (
        <InputTextScreen {...{ onCreateText }} />
    ) : edit ? (
        <EditTranslationScreen {...{ text, setText, lang, setEdit }} />
    ) : (
        <ShowTextScreen {...{ text, lang, setLang, setEdit }} />
    );
};
