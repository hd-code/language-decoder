import * as fs from "fs/promises";
import * as path from "path";
import { constants } from "original-fs";

import { isObject } from "../util/typeguards";

// FIXME: do unit tests something is wrong here
export class FileStorage<T> {
    private filepath: string;
    private store: { [key: string]: T };

    async init(filepath: string, createIfNotExist = true) {
        this.filepath = path.resolve(filepath);
        try {
            fs.access(this.filepath, constants.W_OK);
        } catch (err) {
            if (!createIfNotExist) {
                throw `${filepath} does not exist`;
            }

            this.store = {};
            const dirPath = path.dirname(this.filepath);
            fs.mkdir(dirPath, { recursive: true });
            this.save();
            return;
        }

        const buffer = await fs.readFile(this.filepath);
        const data = JSON.parse(buffer.toString());
        if (!isObject<typeof this.store>(data)) {
            throw `${filepath} is not a known file format`;
        }
        this.store = data;
    }

    get(key: string): T | null {
        return key in this.store ? this.store[key] : null;
    }

    set(key: string, value: T) {
        this.store[key] = value;
        this.save();
    }

    unset(key: string) {
        delete this.store[key];
        this.save();
    }

    private async save() {
        const data = JSON.stringify(this.store);
        fs.writeFile(this.filepath, data);
    }
}
