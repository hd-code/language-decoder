import * as React from "react";
import {
    Api,
    Language,
    Text,
    languageLabelsEnglish,
    tokenize,
} from "../../domain";
import { Select } from "../components";

interface ShowTextScreenProps {
    api: Api;
    text: Text;
    lang: Language;
    setLang: React.Dispatch<Language>;
    setEdit: React.Dispatch<boolean>;
}

export const ShowTextScreen: React.FC<ShowTextScreenProps> = ({
    text,
    lang,
    setLang,
    setEdit,
}) => {
    const [title, ...tex] = tokenize(text.text);

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
                        <small>{text.translations[lang]?.[0][i]}</small>
                        <br />
                    </span>
                ))}
            </h1>

            {tex.map((line, i) => (
                <p key={i} className="flex flex-wrap mb-05 text-center">
                    {line.map((token, j) => (
                        <span key={j} className="mr-025">
                            {token} <br />
                            <small>{text.translations[lang]?.[i + 1][j]}</small>
                            <br />
                        </span>
                    ))}
                </p>
            ))}

            <div className="flex flex-x-justify fixed-bottom w-100 p-05">
                <div>
                    <button className="mr-025">New</button>
                    <button>Open</button>
                </div>

                <div>
                    Translation:
                    <Select
                        options={Object.keys(text.translations).map((l) => ({
                            label: languageLabelsEnglish[l as Language],
                            value: l as Language,
                        }))}
                        selected={lang}
                        onChange={setLang}
                        className="mr-025"
                    />
                    {/* <button className="mr-025">Add</button> */}
                    <button onClick={() => setEdit(true)}>Edit</button>
                </div>

                <div>
                    <button className="mr-025">Export</button>
                    <button>Save</button>
                </div>
            </div>
        </>
    );
};
