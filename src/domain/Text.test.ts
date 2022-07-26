import * as assert from "assert/strict";
import { tokenize } from "./Text";

describe("Text", () => {
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
