import { Text } from "./Text";
import { translate } from "./translate";

export interface Api {
    translate: translate;

    saveText: (text: Text) => Promise<Error | null>;
    loadText: () => Promise<Text | null>;

    exportPDF: (text: Text) => Promise<Error | null>;
}
