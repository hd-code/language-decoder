import * as React from "react";
import {
    Api,
    Language,
    Text,
    languageLabelsEnglish,
    tokenize,
} from "../../domain";

interface ShowTextScreenProps {
    api: Api;
    text: Text;
    setText: React.Dispatch<Text>;
    lang: Language;
    setLang: React.Dispatch<Language>;
    setEdit: React.Dispatch<boolean>;
}

export const ShowTextScreen: React.FC<ShowTextScreenProps> = (props) => {
    const [title, ...text] = tokenize(props.text.text);
    const translation = props.text.translations[props.lang];

    const transHave = Object.keys(props.text.translations) as Language[];
    const transToAdd = Object.values(Language).filter(
        (lang) => lang !== props.text.language && !transHave.includes(lang),
    );

    console.log(text);

    const onCreate = () => {
        props.setText(null);
    };
    const onLoad = async () => {
        const t = await props.api.loadText();
        if (t === null) return;
        const newLang = Object.keys(t.translations)[0] as Language;
        props.setText(t);
        props.setLang(newLang);
    };
    const onSave = async () => {
        await props.api.saveText(props.text);
    };
    const onExport = async () => {
        await props.api.exportPDF(props.text);
    };

    return (
        <>
            <p className="fz-80 mb-1 italic text-center">
                {languageLabelsEnglish[props.text.language]} text
                {props.text.author && ` by ${props.text.author}`}
            </p>

            <h1 className="flex flex-wrap flex-x-center mb-1 fz-120 text-center">
                {textLine(title, translation?.[0] ?? [])}
            </h1>

            {text.map((line, i) => (
                <p key={i} className="flex flex-wrap mb-05 text-center">
                    {textLine(line, translation?.[i + 1] ?? [])}
                </p>
            ))}

            <div className="flex flex-x-justify fixed-bottom w-100 p-05 no-print">
                <div>
                    <button onClick={onCreate} className="mr-025">
                        New
                    </button>
                    <button onClick={onLoad}>Open</button>
                </div>

                <div>
                    Translation:
                    <select
                        className="mr-025"
                        value={props.lang}
                        onChange={(ev) =>
                            props.setLang(ev.target.value as Language)
                        }
                    >
                        {transHave.map((lang) => (
                            <option key={lang} value={lang}>
                                {languageLabelsEnglish[lang]}
                            </option>
                        ))}
                        <option disabled={true}>---</option>
                        {transToAdd.map((lang) => (
                            <option key={lang} value={lang}>
                                + {languageLabelsEnglish[lang]}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => props.setEdit(true)}>
                        {transHave.includes(props.lang) ? "Edit" : "Add"}
                    </button>
                </div>

                <div>
                    <button onClick={onExport} className="mr-025">
                        Export
                    </button>
                    <button onClick={onSave}>Save</button>
                </div>
            </div>
        </>
    );
};

function textLine(tokens: string[], translations: string[]) {
    return tokens.map((token, j) => (
        <span key={j} className="mr-025">
            {token}
            {translations[j] && (
                <>
                    <br />
                    <small>{translations[j]}</small>
                    <br />
                </>
            )}
        </span>
    ));
}
