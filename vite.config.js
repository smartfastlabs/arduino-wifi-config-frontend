import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    solid({ ssr: true }),
    VitePWA({
      registerType: "prompt",
      filename: "service-worker.js",
      srcDir: "src",
      strategies: "injectManifest",
      injectManifest: {
        injectionPoint: undefined,
      },
      manifest: {
        name: "Quickping.io -- Your arduino's link to the world.",
        short_name: "quickping.io",
        description: "Access your arduino from anywhere in the world.",
        theme_color: "#ffff00",
        display: "standalone",
      },
    }),
  ],
  server: {
    port: 3000,
  },
});
