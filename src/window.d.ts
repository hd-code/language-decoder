import { Api } from "./domain/Api";

export {};

declare global {
    interface Window {
        api: Api;
    }
}
