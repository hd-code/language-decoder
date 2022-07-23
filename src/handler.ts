import { ipcMain } from "electron";

import { Language } from "./domain";

export function registerHandlers() {
    ipcMain.handle("translate", handleTranslate);
}

// -----------------------------------------------------------------------------

async function handleTranslate(
    _: unknown,
    word: string,
    from: Language,
    to: Language,
) {
    await sleep(100);
    return tmpTrans[word as keyof typeof tmpTrans] ?? [];
}

// -----------------------------------------------------------------------------

const tmpTrans = {
    the: ["der", "die", "das", "dem", "den"],
    lord: ["Herr", "Herrscher"],
    of: ["von", "aus"],
    rings: ["Ringe"],
    in: ["in", "innen", "drin"],
    a: ["ein", "eine", "eines", "einen", "einem"],
    hole: ["Loch"],
    ground: ["Boden", "Grund"],
    there: ["da", "dort"],
    was: ["war", "waren"],
    hobbit: ["Hobbit"],
};

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
