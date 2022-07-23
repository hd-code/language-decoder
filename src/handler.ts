import { ipcMain } from "electron";

import { Translator } from "./data/Translator";
import { Language } from "./domain";

// -----------------------------------------------------------------------------

const translator = new Translator();

export function registerHandlers() {
    translator.init("/Users/hd/dev/language-decoder/data/");

    ipcMain.handle("translate", handleTranslate);
}

// -----------------------------------------------------------------------------

async function handleTranslate(
    _: unknown,
    word: string,
    from: Language,
    to: Language,
) {
    return translator.translate(word, from, to);
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
