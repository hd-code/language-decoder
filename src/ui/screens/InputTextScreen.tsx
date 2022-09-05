import * as React from "react";
import { Api, Language, Text, languageLabelsEnglish } from "../../domain";

interface InputTextScreenProps {
    api: Api;
    setText: React.Dispatch<Text>;
    setLang: React.Dispatch<Language>;
    setEdit: React.Dispatch<boolean>;
}

export const InputTextScreen: React.FC<InputTextScreenProps> = (props) => {
    const [form, setForm] = React.useState({
        author: "J.R.R. Tolkien",
        title: "The Lord of the Rings",
        text: "In a hole in the ground...\nThere was a hobbit...",
        from: Language.english,
        to: Language.german,
    });

    const onChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        setForm((f) => ({
            ...f,
            [event.target.name]: event.target.value,
        }));
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const t: Text = {
            author: form.author,
            text: `${form.title}\n${form.text}`,
            language: form.from,
            translations: {},
        };
        props.setText(t);
        props.setLang(form.to);
        props.setEdit(true);
    };
    const onOpen = async (event: React.FormEvent) => {
        event.preventDefault();
        const text = await props.api.loadText();
        props.setText(text);
        props.setLang(Object.keys(text.translations)[0] as Language);
    };

    return (
        <form onSubmit={onSubmit}>
            <label className="block">
                Author:
                <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={onChange}
                />
            </label>

            <label className="block">
                From:
                <select name="from" value={form.from} onChange={onChange}>
                    {langOpts()}
                </select>
            </label>

            <label className="block">
                To:
                <select name="to" value={form.to} onChange={onChange}>
                    {langOpts(form.from)}
                </select>
            </label>

            <label className="block">
                Title:
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={onChange}
                />
            </label>

            <label className="block">
                Text:
                <textarea
                    className="block w-100"
                    rows={15}
                    name="text"
                    value={form.text}
                    onChange={onChange}
                />
            </label>

            <button onClick={onOpen}>Open</button>
            <button type="submit">Translate</button>
        </form>
    );
};

const langOpts = (except?: Language) =>
    Object.values(Language)
        .filter((l) => l !== except)
        .map((l) => (
            <option key={l} value={l}>
                {languageLabelsEnglish[l]}
            </option>
        ));
