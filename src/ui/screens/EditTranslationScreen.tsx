import * as React from "react";

import {
    Api,
    Language,
    Text,
    languageLabelsEnglish,
    tokenize,
} from "../../domain";
import { deepClone } from "../../util/clone";

interface EditTranslationScreenProps {
    api: Api;
    text: Text;
    setText: React.Dispatch<Text>;
    lang: Language;
    setEdit: React.Dispatch<boolean>;
}

type tokenMap = { [token: string]: string[] };

export const EditTranslationScreen: React.FC<EditTranslationScreenProps> = ({
    api,
    text,
    setText,
    lang,
    setEdit,
}) => {
    const tokens = tokenize(text.text, true, true);

    const lines = tokenize(text.text);
    const [title, ...tex] = lines;

    const [form, setForm] = React.useState(() => {
        const result: { [name: string]: string } = {};
        lines.forEach((line, i) => {
            line.forEach((_, j) => {
                result[`${i}-${j}`] = text.translations[lang]?.[i]?.[j] ?? "";
            });
        });
        return result;
    });
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };
    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const translation = deepClone(lines);
        for (const name in form) {
            const [i, j] = name.split("-").map((n) => parseInt(n));
            translation[i][j] = form[name];
        }

        const t = deepClone(text);
        t.translations[lang] = translation;
        setText(t);
        setEdit(false);
    };

    const [dict, setDict] = React.useState<tokenMap>(() => {
        const result: tokenMap = {};
        tokenize(text.text, true, true)
            .flat()
            .forEach((token) => {
                result[token] = [];
            });
        return result;
    });
    React.useEffect(() => {
        let count = 0;
        const result = deepClone(dict);

        Object.keys(dict).forEach((token) => {
            api.translate(token, text.language, lang).then((words) => {
                result[token] = words;
                count++;
                if (count === Object.keys(dict).length) {
                    const tmp = deepClone(form);
                    for (const name in tmp) {
                        const [i, j] = name.split("-").map((n) => parseInt(n));
                        const token = tokens[i][j];
                        if (tmp[name] === "" && result[token]?.length >= 1) {
                            tmp[name] = result[token][0];
                        }
                    }

                    setDict(result);
                    setForm(tmp);
                }
            });
        });
    }, []);

    const makeOptions = (word: string, trans?: string) => {
        const opts = dict[tokenize(word, true, true)[0][0]] ?? [];
        if (trans && !opts.includes(trans)) {
            opts.push(trans);
        }
        return opts;
    };

    return (
        <form onSubmit={onSubmit}>
            <p className="fz-80 mb-1 italic text-center">
                {languageLabelsEnglish[text.language]} text
                {text.author && ` by ${text.author}`}
            </p>

            <h1 className="flex flex-wrap flex-x-center mb-1 fz-120 text-center">
                {title.map((token, i) => (
                    <span key={i} className="mr-025">
                        {token} <br />
                        <select
                            name={`0-${i}`}
                            value={form[`0-${i}`]}
                            onChange={onChange}
                        >
                            {makeOptions(
                                token,
                                text.translations[lang]?.[0][i],
                            ).map((word) => (
                                <option key={word} value={word}>
                                    {word}
                                </option>
                            ))}
                        </select>
                    </span>
                ))}
            </h1>

            {tex.map((line, i) => (
                <p key={i} className="flex flex-wrap mb-05 text-center">
                    {line.map((token, j) => (
                        <span key={j} className="mr-025">
                            {token} <br />
                            <select
                                name={`${i + 1}-${j}`}
                                value={form[`${i + 1}-${j}`]}
                                onChange={onChange}
                            >
                                {makeOptions(
                                    token,
                                    text.translations[lang]?.[i + 1][j],
                                ).map((word) => (
                                    <option key={word} value={word}>
                                        {word}
                                    </option>
                                ))}
                            </select>
                        </span>
                    ))}
                </p>
            ))}

            <div className="text-right mt-05">
                <button type="submit">Save</button>
            </div>
        </form>
    );
};
