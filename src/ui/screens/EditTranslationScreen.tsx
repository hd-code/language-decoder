import * as React from "react";

import {
    Api,
    Language,
    Text,
    getTokens,
    languageLabelsEnglish,
    tokenize,
} from "../../domain";
import { deepClone } from "../../util/clone";
import { Select } from "../components";

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
    const [dict, setDict] = React.useState<tokenMap>(() => {
        const result: tokenMap = {};
        getTokens(text).forEach((token) => {
            result[token] = [];
        });
        return result;
    });

    React.useEffect(() => {
        const tokens = getTokens(text);
        const nTokens = tokens.length;
        let count = 0;
        let result = { ...dict };

        tokens.forEach((token) => {
            api.translate(token, text.language, lang).then((words) => {
                console.log(result);
                result = { ...result, [token]: words };
                count++;
                if (count === nTokens) {
                    setDict(result);
                }
            });
        });
    }, []);

    const makeOptions = (word: string, trans?: string) => {
        const opts = dict[tokenize(word, true, true)[0][0]] ?? [];
        if (trans && !opts.includes(trans)) {
            opts.push(trans);
        }
        return opts.map((opt) => ({ label: opt, value: opt }));
    };

    const setTitleWord = (word: string, wordI: number) => {
        const tmp = deepClone(text);
        tmp.translations[lang]!.title[wordI] = word;
        setText(tmp);
    };
    const setWord = (word: string, lineI: number, wordI: number) => {
        const tmp = deepClone(text);
        tmp.translations[lang]!.text[lineI][wordI] = word;
        setText(tmp);
    };

    return (
        <>
            <p className="fz-80 mb-1 italic text-center">
                {languageLabelsEnglish[text.language]} text
                {text.author && ` by ${text.author}`}
            </p>

            <h1 className="flex flex-wrap flex-x-center mb-1 fz-120 text-center">
                {tokenize(text.title)
                    .flat()
                    .map((token, i) => (
                        <span key={i} className="mr-025">
                            {token} <br />
                            <Select
                                options={makeOptions(
                                    token,
                                    text.translations[lang]?.title[i],
                                )}
                                onChange={(v) => setTitleWord(v, i)}
                                selected={text.translations[lang]?.title[i]}
                            />
                        </span>
                    ))}
            </h1>

            {tokenize(text.text).map((line, i) => (
                <p key={i} className="flex flex-wrap mb-05 text-center">
                    {line.map((token, j) => (
                        <span key={j} className="mr-025">
                            {token} <br />
                            <Select
                                options={makeOptions(
                                    token,
                                    text.translations[lang]?.text[i][j],
                                )}
                                onChange={(v) => setWord(v, i, j)}
                                selected={text.translations[lang]?.text[i][j]}
                            />
                        </span>
                    ))}
                </p>
            ))}

            <div className="text-right mt-05">
                <button onClick={() => setEdit(false)}>Save</button>
            </div>
        </>
    );
};
