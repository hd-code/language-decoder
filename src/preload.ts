import { contextBridge, ipcRenderer } from "electron";

import { Api } from "./domain";

const api: Api = {
    translate: (word, from, to) =>
        ipcRenderer.invoke("translate", word, from, to),
};

contextBridge.exposeInMainWorld("api", api);
