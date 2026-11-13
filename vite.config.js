import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

// Where the site is served from. "/" for a normal domain; the GitHub Pages workflow sets
// BASE_PATH=/kidpool-web/ so the build works at https://<org>.github.io/kidpool-web/.
// Images and links go through src/lib/base.js, so every page works under either.
const BASE = (() => {
  const b = (process.env.BASE_PATH || "/").trim();
  return ("/" + b + "/").replace(/\/{2,}/g, "/");
})();

export default defineConfig(({ isSsrBuild }) => ({
  base: BASE,
  plugins: [
    react(),
    {
      // `vite preview` only: serve the pre-rendered pages (/privacy, /terms) and the
      // 404 page for unknown addresses, the way a static host would.
      name: "prerendered-routes",
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          const [full, q = ""] = (req.url || "/").split("?");
          const inBase = full.startsWith(BASE) || full + "/" === BASE;
          const p = inBase ? "/" + full.slice(BASE.length) : full;
          const clean = p.replace(/\/+$/, "");
          const page = path.join(root, "dist", clean, "index.html");
          if (clean && fs.existsSync(page)) req.url = `${BASE}${clean.slice(1)}/index.html${q ? "?" + q : ""}`;
          else if (clean && !path.extname(clean) && req.headers.accept?.includes("text/html")) req.url = `${BASE}404.html`;
          next();
        });
      },
    },
  ],
  build: isSsrBuild
    ? {} // build-time pre-render bundle (see scripts/prerender.mjs)
    : {
        rollupOptions: {
          // keep three.js in its own chunk; it is loaded lazily with the 3D scenes
          output: { manualChunks: { three: ["three"], react: ["react", "react-dom"] } },
        },
        chunkSizeWarningLimit: 800,
      },
}));
