import * as React from "react";
import { Language, Text } from "../domain";
import {
    EditTranslationScreen,
    InputTextScreen,
    ShowTextScreen,
} from "./screens";

export const App: React.FC = () => {
    const api = window.api;

    const [text, setText] = React.useState<Text | null>(null);
    const [lang, setLang] = React.useState<Language>(Language.german);
    const [edit, setEdit] = React.useState(false);

    return text === null ? (
        <InputTextScreen {...{ api, setText, setLang, setEdit }} />
    ) : edit ? (
        <EditTranslationScreen {...{ api, text, setText, lang, setEdit }} />
    ) : (
        <ShowTextScreen {...{ api, text, setText, lang, setLang, setEdit }} />
    );
};
