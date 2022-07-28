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
    lang: Language;
    setLang: React.Dispatch<Language>;
    setEdit: React.Dispatch<boolean>;
}

export const ShowTextScreen: React.FC<ShowTextScreenProps> = ({
    api,
    text,
    lang,
    setLang,
    setEdit,
}) => {
    const [title, ...tex] = tokenize(text.text);

    const translationsHave = Object.keys(text.translations) as Language[];
    const translationsToAdd = Object.values(Language).filter(
        (lang) => lang !== text.language && !translationsHave.includes(lang),
    );

    const onSave = async () => {
        const err = await api.saveText(text);
        if (err) {
            console.error(err)
        }
    }

    return (
        <>
            <p className="fz-80 mb-1 italic text-center">
                {languageLabelsEnglish[text.language]} text
                {text.author && ` by ${text.author}`}
            </p>

            <h1 className="flex flex-wrap flex-x-center mb-1 fz-120 text-center">
                {textLine(title, text.translations[lang]?.[0] ?? [])}
            </h1>

            {tex.map((line, i) => (
                <p key={i} className="flex flex-wrap mb-05 text-center">
                    {textLine(line, text.translations[lang]?.[i + 1] ?? [])}
                </p>
            ))}

            <div className="flex flex-x-justify fixed-bottom w-100 p-05">
                <div>
                    <button className="mr-025">New</button>
                    <button>Open</button>
                </div>

                <div>
                    Translation:
                    <select
                        className="mr-025"
                        value={lang}
                        onChange={(ev) => setLang(ev.target.value as Language)}
                    >
                        {translationsHave.map((lang) => (
                            <option key={lang} value={lang}>
                                {languageLabelsEnglish[lang]}
                            </option>
                        ))}
                        <option disabled={true}>---</option>
                        {translationsToAdd.map((lang) => (
                            <option key={lang} value={lang}>
                                + {languageLabelsEnglish[lang]}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => setEdit(true)}>
                        {translationsHave.includes(lang) ? "Edit" : "Add"}
                    </button>
                </div>

                <div>
                    <button className="mr-025">Export</button>
                    <button onClick={() => onSave()}>Save</button>
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
