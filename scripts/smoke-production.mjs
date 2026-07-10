import { chromium } from "playwright";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3002";
const routeChecks = [
  {
    route: "/",
    heading: /InnerScript navigation|Innerscript/i,
    controls: [/New Note/i, /New Folder/i],
    links: [/Search/i, /Imports/i, /People/i, /Insights/i, /Privacy/i],
    openMenuOnMobile: true,
  },
  { route: "/search", heading: /Search/i, textboxes: [/Search query/i], controls: [/Search/i] },
  { route: "/imports", heading: /Imports/i, textboxes: [/Import content/i], controls: [/Preview/i, /Confirm/i] },
  { route: "/people", heading: /People/i, textboxes: [/Person name/i], controls: [/Add/i] },
  { route: "/insights", heading: /Insights/i },
  { route: "/settings/privacy", heading: /Privacy/i, controls: [/Export data/i, /Delete/i] },
];

const browser = await chromium.launch();
const viewports = [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
];
const failures = [];

async function expectVisible(locator, message) {
  try {
    await locator.first().waitFor({ state: "visible", timeout: 5000 });
  } catch {
    failures.push(message);
  }
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });

  page.on("pageerror", (error) => {
    failures.push(`${viewport.width}px page error: ${error.message}`);
  });

  page.on("console", (message) => {
    if (["error"].includes(message.type())) {
      failures.push(`${viewport.width}px console error: ${message.text()}`);
    }
  });

  for (const check of routeChecks) {
    const response = await page.goto(new URL(check.route, baseUrl).toString(), {
      waitUntil: "networkidle",
      timeout: 15000,
    });

    if (!response?.ok()) {
      failures.push(`${viewport.width}px ${check.route} returned ${response?.status() ?? "no response"}`);
      continue;
    }

    if (check.openMenuOnMobile && viewport.width < 768) {
      await page.getByRole("button", { name: /Menu/i }).click();
    }

    await expectVisible(
      page.getByRole("heading", { name: check.heading }),
      `${viewport.width}px ${check.route} missing heading ${check.heading}`,
    );

    for (const control of check.controls ?? []) {
      await expectVisible(
        page.getByRole("button", { name: control }),
        `${viewport.width}px ${check.route} missing button ${control}`,
      );
    }

    for (const link of check.links ?? []) {
      await expectVisible(
        page.getByRole("link", { name: link }),
        `${viewport.width}px ${check.route} missing link ${link}`,
      );
    }

    for (const textbox of check.textboxes ?? []) {
      await expectVisible(
        page.getByRole("textbox", { name: textbox }),
        `${viewport.width}px ${check.route} missing textbox ${textbox}`,
      );
    }
  }

  const apiChecks = ["/api/health", "/api/system/readiness"];
  for (const route of apiChecks) {
    const response = await page.request.get(new URL(route, baseUrl).toString());
    if (!response.ok()) {
      failures.push(`${route} returned ${response.status()}`);
    }
  }

  await page.close();
}

await browser.close();

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Smoke passed for ${routeChecks.length} pages across ${viewports.length} viewports at ${baseUrl}`);
