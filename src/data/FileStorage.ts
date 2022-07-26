import * as fs from "fs/promises";
import * as path from "path";

export class FileStorage<T> {
    private filepath: string;
    private store: { [key: string]: T } = {};

    async init(filepath: string, createIfNotExist = true) {
        this.filepath = path.resolve(filepath);

        try {
            const buffer = await fs.readFile(this.filepath);
            const data = JSON.parse(buffer.toString());
            if (
                typeof data !== "object" ||
                data == null ||
                data instanceof Array
            ) {
                throw `${filepath} is not a known file format`;
            }
            this.store = data;
        } catch (err) {
            if (err?.code !== "ENOENT") {
                throw err;
            }

            if (!createIfNotExist) {
                throw err;
            }

            const dirPath = path.dirname(this.filepath);
            await fs.mkdir(dirPath, { recursive: true });
            await this.save();
        }
    }

    get(key: string): T | null {
        return this.store[key] ?? null;
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
        await fs.writeFile(this.filepath, data);
    }
}
