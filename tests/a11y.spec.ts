import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Add new routes here as the site grows.
const pages = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "404", path: "/404" },
];

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const { name, path } of pages) {
  test.describe(`${name} (${path})`, () => {
    for (const colorScheme of ["light", "dark"] as const) {
      test(`has no detectable WCAG A/AA violations in ${colorScheme} mode`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme });
        await page.goto(path);

        const results = await new AxeBuilder({ page })
          .withTags(WCAG_TAGS)
          .analyze();

        expect(results.violations).toEqual([]);
      });
    }
  });
}

test.describe("Keyboard navigation", () => {
  test("skip link is the first focusable element and jumps to main content", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Keyboard test is desktop-only");

    await page.goto("/");
    await page.keyboard.press("Tab");

    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#content$/);
    await expect(page.locator("main#content")).toBeVisible();
  });
});
