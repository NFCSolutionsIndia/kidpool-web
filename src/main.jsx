import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles/kidpool.css";
import { installRipple } from "./lib/ripple";

installRipple();

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// Built pages arrive pre-rendered: take over that HTML (no rebuild, so the hero's entrance
// keeps playing smoothly). In development the root is empty, so render from scratch.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
