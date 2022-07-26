import { contextBridge } from "electron";
import { createApi } from "./ipc/invoker";

contextBridge.exposeInMainWorld("api", createApi());
