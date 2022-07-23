import * as React from "react";

import { Language, languageLabelsEnglish } from "../../domain/Language";
import { Text, tokenize } from "../../domain/Text";
import { Select } from "../components";

interface ShowTextScreenProps {
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
                            <small>{text.translations[lang]?.title[i]}</small>
                            <br />
                        </span>
                    ))}
            </h1>

            {tokenize(text.text).map((line, i) => (
                <p key={i} className="flex flex-wrap mb-05 text-center">
                    {line.map((token, j) => (
                        <span key={j} className="mr-025">
                            {token} <br />
                            <small>{text.translations[lang]?.text[i][j]}</small>
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
