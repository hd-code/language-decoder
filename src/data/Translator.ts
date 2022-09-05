import * as fs from "fs/promises";
import * as path from "path";
import { Language, translate } from "../domain";
import { FileStorage } from "./FileStorage";

export class Translator {
    private fileStorage: FileStorage<string[]>;
    private filename: string;

    constructor(private dictDirPath: string, private webTranslate: translate) {}

    async init() {
        this.dictDirPath = path.resolve(this.dictDirPath);
        try {
            await fs.readdir(this.dictDirPath);
        } catch (err) {
            await fs.mkdir(this.dictDirPath, { recursive: true });
        }
    }

    async translate(word: string, from: Language, to: Language) {
        const filename = `${from}-${to}.json`;
        if (this.filename !== filename) {
            this.filename = filename;
            this.fileStorage = new FileStorage();
            await this.fileStorage.init(path.join(this.dictDirPath, filename));
        }

        const words = this.fileStorage.get(word);
        if (words !== null) {
            return words;
        }

        try {
            const newWords = await this.webTranslate(word, from, to);
            this.fileStorage.set(word, newWords);
            return newWords;
        } catch (err) {
            console.error("Error on online translate", err);
        }
        return [word];
    }
}
