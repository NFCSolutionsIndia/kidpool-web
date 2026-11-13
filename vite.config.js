import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // keep three.js in its own cached chunk
      output: { manualChunks: { three: ["three"], react: ["react", "react-dom"] } },
    },
    chunkSizeWarningLimit: 800,
  },
});
