import * as React from "react";
import { deepClone } from "../../../lib/clone";
import {
    Api,
    Language,
    Text,
    languageLabelsEnglish,
    tokenize,
} from "../../domain";

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
    const onAbort = () => {
        setEdit(false);
    };

    const [dict, setDict] = React.useState<tokenMap>({});
    React.useEffect(() => {
        const newDict: tokenMap = {};
        tokens.flat().forEach((token) => {
            newDict[token] = [];
        });
        const nTokens = Object.keys(newDict).length;
        let count = 0;

        Object.keys(newDict).forEach((token) => {
            api.translate(token, text.language, lang).then((words) => {
                newDict[token] = words;
                if (++count >= nTokens) {
                    for (const name in form) {
                        if (form[name] !== "") continue;
                        const [i, j] = name.split("-").map((x) => parseInt(x));
                        const token = tokens[i][j];
                        if (newDict[token]?.length >= 1) {
                            setForm((prev) => ({
                                ...prev,
                                [name]: newDict[token][0],
                            }));
                        }
                    }
                    setDict(newDict);
                }
            });
        });
    }, [lang]);

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
                <button onClick={onAbort} className="mr-025">
                    Abort
                </button>
                <button type="submit">Save</button>
            </div>
        </form>
    );
};
