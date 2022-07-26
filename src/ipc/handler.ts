import * as path from "path";
import { ipcMain } from "electron";
import { Translator } from "../data/Translator";

export function registerHandlers(dataDir: string) {
    const translator = new Translator();
    translator.init(path.join(dataDir, "dicts"));

    ipcMain.handle("translate", (_, word, from, to) =>
        translator.translate(word, from, to),
    );
}
