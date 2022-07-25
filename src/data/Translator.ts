import * as fs from "fs/promises";
import * as path from "path";

import { Language } from "../domain";

import { FileStorage } from "./FileStorage";

export class Translator {
    private dictDirPath: string;
    private fileStorage = new FileStorage<string[]>();
    private filename: string;

    async init(dictDirPath: string) {
        this.dictDirPath = path.resolve(dictDirPath);
        try {
            await fs.readdir(this.dictDirPath);
        } catch (err) {
            fs.mkdir(this.dictDirPath, { recursive: true });
        }
    }

    async translate(word: string, from: Language, to: Language) {
        const filename = `${from}-${to}.json`;
        if (this.filename !== filename) {
            this.filename = filename;
            await this.fileStorage.init(path.join(this.dictDirPath, filename));
        }

        return this.fileStorage.get(word) ?? [];
    }
}
