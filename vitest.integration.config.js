import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "server-only": fileURLToPath(
        new URL("./tests/integration/server-only-stub.js", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/integration/**/*.test.js"],
    setupFiles: ["tests/integration/setup.js"],
  },
});
