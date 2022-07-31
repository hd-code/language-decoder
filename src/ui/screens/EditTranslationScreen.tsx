import * as React from "react";
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

export const EditTranslationScreen: React.FC<EditTranslationScreenProps> = (
    props,
) => {
    const tokens = tokenize(props.text.text, true, true);

    const lines = tokenize(props.text.text);
    const [title, ...text] = lines;

    const translation = props.text.translations?.[props.lang] ?? [];

    const [form, setForm] = React.useState(() => {
        const result: { [name: string]: string } = {};
        lines.forEach((line, i) => {
            line.forEach((_, j) => {
                result[`${i}-${j}`] = translation[i]?.[j] ?? "";
            });
        });
        return result;
    });
    const addTransFromDict = (dict: tokenMap) => {
        const newForm: typeof form = {};
        for (const name in form) {
            const [i, j] = name.split("-").map((x) => parseInt(x));
            const token = tokens[i][j];
            newForm[name] = dict[token]?.[0] ?? "";
        }
        setForm(newForm);
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
            props.api
                .translate(token, props.text.language, props.lang)
                .then((words) => {
                    newDict[token] = words;
                    if (++count >= nTokens) {
                        if (translation.length === 0) {
                            addTransFromDict(newDict);
                        }
                        setDict(newDict);
                    }
                });
        });
    }, [props.lang]);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [event.target.name]: event.target.value }));
    };
    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const newTrans = lines.map((line) => line.map(() => ""));
        for (const name in form) {
            const [i, j] = name.split("-").map((n) => parseInt(n));
            newTrans[i][j] = form[name];
        }

        props.setText({
            ...props.text,
            translations: {
                ...props.text.translations,
                [props.lang]: newTrans,
            },
        });
        props.setEdit(false);
    };
    const onAbort = () => {
        props.setEdit(false);
    };

    return (
        <form onSubmit={onSubmit}>
            <p className="fz-80 mb-1 italic text-center">
                {languageLabelsEnglish[props.text.language]} text
                {props.text.author && ` by ${props.text.author}`}
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
                            {dict[tokens[0][i]]?.map(opt)}
                        </select>
                    </span>
                ))}
            </h1>

            {text.map((line, i) => (
                <p key={i} className="flex flex-wrap mb-05 text-center">
                    {line.map((token, j) => (
                        <span key={j} className="mr-025">
                            {token} <br />
                            <select
                                name={`${i + 1}-${j}`}
                                value={form[`${i + 1}-${j}`]}
                                onChange={onChange}
                            >
                                {dict[tokens[i + 1][j]]?.map(opt)}
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

const opt = (value: string) => (
    <option key={value} value={value}>
        {value}
    </option>
);
