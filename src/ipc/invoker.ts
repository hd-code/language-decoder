import { ipcRenderer } from "electron";
import { Api } from "../domain";

export function createApi(): Api {
    return {
        translate: (word, from, to) =>
            ipcRenderer.invoke("translate", word, from, to),
    };
}
