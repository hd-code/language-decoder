import * as React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(React.createElement(App));
