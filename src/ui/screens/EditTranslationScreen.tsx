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
    const [translation, setTranslation] = React.useState<string[][]>(() => {
        return (
            deepClone(text.translations[lang]) ??
            tokenize(text.text).map((line) => line.map(() => null))
        );
    });
    const setTrans = (word: string, i: number, j: number) => {
        let trans = deepClone(translation);
        trans[i][j] = word;
        setTranslation(trans);
    };
    const addTransToEmpty = (dict: tokenMap) => {
        const tmp = deepClone(translation);
        tokenize(text.text, true, true).forEach((line, i) => {
            line.forEach((token, j) => {
                if (tmp[i][j] === null && dict[token].length >= 1) {
                    tmp[i][j] = dict[token][0];
                }
            });
        });
        setTranslation(tmp);
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
        const tokens = Object.keys(dict);
        const nTokens = tokens.length;
        let count = 0;
        let result = deepClone(dict);

        tokens.forEach((token) => {
            api.translate(token, text.language, lang).then((words) => {
                result[token] = words;
                count++;
                if (count === nTokens) {
                    setDict(result);
                    addTransToEmpty(result);
                }
            });
        });
    }, []);

    const [title, ...tex] = tokenize(text.text);

    const makeOptions = (word: string, trans?: string) => {
        const opts = dict[tokenize(word, true, true)[0][0]] ?? [];
        if (trans && !opts.includes(trans)) {
            opts.push(trans);
        }
        return opts;
    };

    const save = () => {
        const t = deepClone(text);
        t.translations[lang] = translation;
        setText(t);
        setEdit(false);
    };

    return (
        <>
            <p className="fz-80 mb-1 italic text-center">
                {languageLabelsEnglish[text.language]} text
                {text.author && ` by ${text.author}`}
            </p>

            <h1 className="flex flex-wrap flex-x-center mb-1 fz-120 text-center">
                {title.map((token, i) => (
                    <span key={i} className="mr-025">
                        {token} <br />
                        <select
                            onChange={(event) =>
                                setTrans(event.target.value, 0, i)
                            }
                            value={translation?.[0][i] ?? ""}
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
                                onChange={(event) =>
                                    setTrans(event.target.value, i + 1, j)
                                }
                                value={translation?.[i + 1][j] ?? ""}
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
                <button onClick={() => save()}>Save</button>
            </div>
        </>
    );
};
