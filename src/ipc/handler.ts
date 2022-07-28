import * as fs from "fs/promises";
import * as path from "path";
import { FileFilter, dialog, ipcMain } from "electron";
import { Translator } from "../data/Translator";

export function registerHandlers(dataDir: string) {
    const translator = new Translator();
    translator.init(path.join(dataDir, "dicts"));

    ipcMain.handle("translate", (_, word, from, to) =>
        translator.translate(word, from, to),
    );

    ipcMain.handle("text_save", async (_, text) => {
        const { canceled, filePath } = await dialog.showSaveDialog({
            properties: ["createDirectory"],
            filters: [fileFilter],
        });
        if (canceled) return;
        try {
            const data = JSON.stringify(text);
            await fs.writeFile(filePath, data);
            return null;
        } catch (err) {
            console.error(err);
            return err;
        }
    });
}

const fileFilter: FileFilter = { name: "JSON", extensions: ["json"] };
