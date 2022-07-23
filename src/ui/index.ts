import * as React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(React.createElement(App));