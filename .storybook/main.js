
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */
const config = {
  "stories": [
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ],
  async viteFinal(config) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": path.resolve(dirname, ".."),
    };

    config.optimizeDeps = config.optimizeDeps ?? {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      "@base-ui/react/tooltip",
      "mockdate",
      "msw-storybook-addon",
    ];

    return config;
  }
};
export default config;
