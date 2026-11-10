import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const isMobile = (projectName: string) => projectName === "mobile";

const primaryNav = (page: Page) =>
  page.getByRole("navigation", { name: "Primary" });

test.describe("Primary navigation", () => {
  test("marks the current page with aria-current", async ({ page }, testInfo) => {
    await page.goto("/about");
    const nav = primaryNav(page);

    if (isMobile(testInfo.project.name)) {
      await nav.getByRole("button", { name: "Menu" }).click();
    }

    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(nav.getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  test("shows links without a toggle on desktop", async ({ page }, testInfo) => {
    test.skip(isMobile(testInfo.project.name), "Desktop-only");

    await page.goto("/");
    const nav = primaryNav(page);

    await expect(nav.getByRole("button", { name: "Menu" })).toBeHidden();
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
  });
});

test.describe("Mobile menu", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(!isMobile(testInfo.project.name), "Mobile-only");
  });

  test("opens and closes with the toggle", async ({ page }) => {
    await page.goto("/");
    const nav = primaryNav(page);
    const toggle = nav.getByRole("button", { name: "Menu" });
    const aboutLink = nav.getByRole("link", { name: "About" });

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(aboutLink).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(aboutLink).toBeVisible();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(aboutLink).toBeHidden();
  });

  test("Escape closes the menu and returns focus to the toggle", async ({ page }) => {
    await page.goto("/");
    const nav = primaryNav(page);
    const toggle = nav.getByRole("button", { name: "Menu" });

    await toggle.click();
    await nav.getByRole("link", { name: "Home" }).focus();
    await page.keyboard.press("Escape");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
  });

  test("closes when clicking outside", async ({ page }) => {
    await page.goto("/");
    const toggle = primaryNav(page).getByRole("button", { name: "Menu" });

    await toggle.click();
    await page.locator("main").click();

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("has no axe violations while open", async ({ page }) => {
    await page.goto("/");
    await primaryNav(page).getByRole("button", { name: "Menu" }).click();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("shows all links and no toggle", async ({ page }) => {
      await page.goto("/");
      const nav = primaryNav(page);

      await expect(nav.getByRole("button", { name: "Menu" })).toBeHidden();
      await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
    });
  });
});

test.describe("Footer", () => {
  test("has navigation and a copyright notice", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");

    await expect(
      footer.getByRole("navigation", { name: "Footer" }).getByRole("link"),
    ).toHaveCount(2);
    await expect(footer).toContainText(`© ${new Date().getFullYear()}`);
  });
});
