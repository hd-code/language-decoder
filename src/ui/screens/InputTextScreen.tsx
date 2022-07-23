import * as React from "react";

import { Language, languageLabelsEnglish } from "../../domain/Language";
import { Text } from "../../domain/Text";
import { Select } from "../components";

interface InputTextScreenProps {
    onCreateText: (t: Text, l: Language) => void;
}

export const InputTextScreen: React.FC<InputTextScreenProps> = ({
    onCreateText,
}) => {
    const [author, setAuthor] = React.useState("J.R.R. Tolkien");
    const [title, setTitle] = React.useState("The Lord of the Rings");
    const [text, setText] = React.useState(
        "In a hole in the ground...\nThere was a hobbit...",
    );

    const [from, setFrom] = React.useState(Language.english);
    const [to, setTo] = React.useState(Language.german);

    const submit = () => {
        const t: Text = {
            author,
            title,
            text,
            language: from,
            translations: {},
        };
        onCreateText(t, to);
    };

    return (
        <>
            <label className="block">
                Author:
                <input
                    type="text"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                />
            </label>

            <label className="block">
                From:
                <Select options={langOpts} selected={from} onChange={setFrom} />
            </label>

            <label className="block">
                To:
                <Select options={langOpts} selected={to} onChange={setTo} />
            </label>

            <label className="block">
                Title:
                <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </label>

            <label className="block">
                Text:
                <textarea
                    className="block w-100"
                    rows={15}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                />
            </label>

            <button onClick={submit}>Translate</button>
        </>
    );
};

const langOpts = Object.keys(Language).map((lang) => {
    const value = Language[lang as keyof typeof Language];
    return {
        label: languageLabelsEnglish[value],
        value,
    };
});
