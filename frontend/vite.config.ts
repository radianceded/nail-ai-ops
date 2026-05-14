import react from "@vitejs/plugin-react";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function rootAssetsPlugin(): Plugin {
  const assetsRoot = resolve(currentDir, "../assets");

  return {
    name: "root-assets",
    configureServer(server) {
      server.middlewares.use("/assets", (req, res, next) => {
        const pathname = decodeURIComponent((req.url ?? "").split("?")[0]);
        const requestedPath = normalize(join(assetsRoot, pathname));

        if (!requestedPath.startsWith(`${assetsRoot}${sep}`)) {
          res.statusCode = 403;
          res.end("Forbidden");
          return;
        }

        if (!existsSync(requestedPath) || !statSync(requestedPath).isFile()) {
          next();
          return;
        }

        res.setHeader(
          "Content-Type",
          contentTypes[extname(requestedPath).toLowerCase()] ??
            "application/octet-stream",
        );
        createReadStream(requestedPath).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), rootAssetsPlugin()],
  server: {
    port: 5173,
  },
});
