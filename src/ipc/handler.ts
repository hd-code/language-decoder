import * as fs from "fs/promises";
import * as path from "path";
import {
    BrowserWindow,
    FileFilter,
    PrintToPDFOptions,
    dialog,
    ipcMain,
} from "electron";
import { Translator } from "../data/Translator";
import { isText } from "../domain";

export function registerHandlers(dataDir: string) {
    const translator = new Translator();
    translator.init(path.join(dataDir, "dicts"));

    ipcMain.handle("translate", (_, word, from, to) =>
        translator.translate(word, from, to),
    );

    ipcMain.handle("text_save", async (_, text) => {
        const { canceled, filePath } = await dialog.showSaveDialog({
            filters: [fileFilter],
            properties: ["createDirectory"],
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

    ipcMain.handle("text_load", async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            filters: [fileFilter],
            properties: ["openFile"],
        });
        if (canceled) return null;

        try {
            const buffer = await fs.readFile(filePaths[0]);
            const text = JSON.parse(buffer.toString());
            if (!isText(text)) {
                throw "unknown file format";
            }
            return text;
        } catch (err) {
            console.error(err);
            return null;
        }
    });

    ipcMain.handle("text_export_pdf", async (_, text) => {
        const win = BrowserWindow.getFocusedWindow();
        const { canceled, filePath } = await dialog.showSaveDialog({
            filters: [pdfFilter],
            properties: ["createDirectory"],
        });
        if (canceled) return null;

        try {
            const opts: PrintToPDFOptions = { pageSize: "A4" };
            const pdf = await win.webContents.printToPDF(opts);
            await fs.writeFile(filePath, pdf);
            return null;
        } catch (err) {
            console.error(err);
            return err;
        }
    });
}

const fileFilter: FileFilter = { name: "JSON", extensions: ["json"] };
const pdfFilter: FileFilter = { name: "PDF", extensions: ["pdf"] };
