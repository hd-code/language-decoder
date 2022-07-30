import { ipcRenderer } from "electron";
import { Api } from "../domain";

export function createApi(): Api {
    return {
        translate: (word, from, to) =>
            ipcRenderer.invoke("translate", word, from, to),
        saveText: (text) => ipcRenderer.invoke("text_save", text),
        loadText: () => ipcRenderer.invoke("text_load"),
        exportPDF: (text) => ipcRenderer.invoke("text_export_pdf", text),
    };
}
