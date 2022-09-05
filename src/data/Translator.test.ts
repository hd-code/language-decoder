import * as assert from "assert/strict";
import * as fs from "fs";
import * as path from "path";
import { Language } from "../domain";
import { Translator } from "./Translator";

class TranslateStub {
    private static _numOfCalls = 0;
    static get numOfCalls() {
        return TranslateStub._numOfCalls;
    }

    static returns: string[] = [];

    static translate() {
        TranslateStub._numOfCalls++;
        return Promise.resolve(TranslateStub.returns);
    }
}

describe(Translator.name, () => {
    const dirPath = path.join(__dirname, "__testfolder__baiUhs");
    const translateStub = () => TranslateStub.translate();

    const translator = new Translator(dirPath, translateStub);

    describe("init", () => {
        after(() => fs.rmdirSync(dirPath));

        it("should create dir when not present", async () => {
            try {
                fs.rmdirSync(dirPath);
            } catch (e) {} // eslint-disable-line no-empty
            await translator.init();
            const dirContent = fs.readdirSync(dirPath);
            assert.deepEqual(dirContent, []);
        });

        it("should do nothing when dir is present", async () => {
            const dirContentBefore = fs.readdirSync(dirPath);
            await translator.init();
            const dirContentAfter = fs.readdirSync(dirPath);
            assert.deepEqual(dirContentBefore, dirContentAfter);
        });
    });

    describe("translate", () => {
        before(async () => await translator.init());
        after(() => fs.rmdirSync(dirPath, { recursive: true }));

        const dict = { haus: ["house", "home"] };
        const filename = "de-en.json";

        it("should not have dict file yet", () => {
            assert.deepEqual(fs.readdirSync(dirPath), []);
        });

        it("should return correct translations", async () => {
            TranslateStub.returns = dict["haus"];
            const got = await translator.translate(
                "haus",
                Language.german,
                Language.english,
            );
            assert.deepEqual(got, dict["haus"]);
        });

        it("dict file should have been created", async () => {
            assert.deepEqual(fs.readdirSync(dirPath), [filename]);

            const data = fs.readFileSync(path.join(dirPath, "de-en.json"));
            assert.deepEqual(JSON.parse(data.toString()), dict);
        });

        it("should read translations from cache when asked again", async () => {
            const nCalls = TranslateStub.numOfCalls;
            await translator.translate(
                "haus",
                Language.german,
                Language.english,
            );
            assert.equal(nCalls, TranslateStub.numOfCalls);
        });

        it("should return translations from existing dict file", async () => {
            const word = "quality";
            const translations = ["Qualität", "Standard"];

            const data = JSON.stringify({ [word]: translations });
            fs.writeFileSync(path.join(dirPath, "en-de.json"), data);

            const nCalls = TranslateStub.numOfCalls;

            const got = await translator.translate(
                word,
                Language.english,
                Language.german,
            );

            assert.deepEqual(got, translations);
            assert.equal(nCalls, TranslateStub.numOfCalls);
        });
    });
});
