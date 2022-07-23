import { Api } from "./domain";

export {};

declare global {
    interface Window {
        api: Api;
    }
}
