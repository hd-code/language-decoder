import * as React from "react";
import { Api, Language, Text, languageLabelsEnglish } from "../../domain";

interface InputTextScreenProps {
    api: Api;
    onCreateText: (t: Text, l: Language) => void;
}

export const InputTextScreen: React.FC<InputTextScreenProps> = ({
    onCreateText,
}) => {
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
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const t: Text = {
            author: form.author,
            text: `${form.title}\n${form.text}`,
            language: form.from,
            translations: {},
        };
        onCreateText(t, form.to);
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
                    {langOpts}
                </select>
            </label>

            <label className="block">
                To:
                <select name="to" value={form.to} onChange={onChange}>
                    {langOpts}
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

            <button type="submit">Translate</button>
        </form>
    );
};

const langOpts = Object.keys(Language).map((lang) => {
    const value = Language[lang as keyof typeof Language];
    return (
        <option key={value} value={value}>
            {languageLabelsEnglish[value]}
        </option>
    );
});
