import * as assert from "assert/strict";
import { Language } from "./Language";
import { Text, isText, tokenize } from "./Text";

describe("Text", () => {
    describe(isText.name, () => {
        const testText: Text = {
            author: "J.R.R. Tolkien",
            text: "The Lord of the Rings\nIn a hole in the ground...\nThere was a hobbit...",
            language: Language.english,
            translations: {
                [Language.german]: [
                    ["der", "Herr", "von", "die", "Ringe"],
                    ["in", "ein", "Loch", "in", "der", "Boden"],
                    ["dort", "war", "ein", "Hobbit"],
                ],
            },
        };

        const testCases: [string, unknown, boolean][] = [
            ["success", testText, true],
            ["no translations", { ...testText, translations: {} }, false],
            [
                "missing line in trans",
                {
                    ...testText,
                    translations: {
                        [Language.german]: testText.translations[
                            Language.german
                        ]?.slice(0, -1),
                    },
                },
                false,
            ],
            [
                "missing word in trans title",
                {
                    ...testText,
                    translations: {
                        [Language.german]: testText.translations[
                            Language.german
                        ]?.map((line, i) =>
                            i === 0 ? line.slice(0, -1) : line,
                        ),
                    },
                },
                false,
            ],
        ];

        testCases.forEach(([name, arg, want]) => {
            it(name, () => {
                const got = isText(arg);
                assert.equal(got, want);
            });
        });
    });

    describe(tokenize.name, () => {
        const testCases: [
            string,
            boolean | undefined,
            boolean | undefined,
            string[][],
        ][] = [
            [
                "Buenos días,\n¿Cómo estás?",
                undefined,
                undefined,
                [
                    ["Buenos", "días,"],
                    ["¿Cómo", "estás?"],
                ],
            ],
            [
                "Buenos días,\n¿Cómo estás?",
                true,
                true,
                [
                    ["buenos", "días"],
                    ["cómo", "estás"],
                ],
            ],
            [
                "Buenos días,\n¿Cómo estás?",
                true,
                false,
                [
                    ["Buenos", "días"],
                    ["Cómo", "estás"],
                ],
            ],
            [
                "Buenos días,\n¿Cómo estás?",
                false,
                true,
                [
                    ["buenos", "días,"],
                    ["¿cómo", "estás?"],
                ],
            ],
            [
                "Buenos días,\n¿Cómo estás?",
                false,
                false,
                [
                    ["Buenos", "días,"],
                    ["¿Cómo", "estás?"],
                ],
            ],
            [
                "Hello Moto,\n... etc.",
                true,
                true,
                [
                    ["hello", "moto"],
                    ["", "etc"],
                ],
            ],
        ];
        testCases.forEach(([text, strip, lower, want]) => {
            it(`${text.replace("\n", "  ")} => ${want}`, () => {
                const got = tokenize(text, strip, lower);
                assert.deepEqual(got, want);
            });
        });
    });
});
