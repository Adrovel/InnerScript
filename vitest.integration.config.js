import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));
const serverOnlyStub = path.join(dirname, "node_modules/server-only/empty.js");

export default defineConfig({
  resolve: {
    alias: {
      "server-only": serverOnlyStub,
    },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.js"],
    setupFiles: ["tests/integration/setup.js"],
    pool: "forks",
    fileParallelism: false,
  },
});
