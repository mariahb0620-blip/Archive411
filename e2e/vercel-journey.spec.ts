import { test, expect } from "@playwright/test";
import {
  completeBuildFlow,
  signIn,
  signOut,
  signUp,
  skipIntro,
  testEmail,
} from "./helpers";

test.describe.configure({ mode: "serial" });

test.describe("Vercel full user journey", () => {
  const email = testEmail("vercel-journey");
  let lookbookUrl = "";

  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
  });

  test("intro skip → sign up", async ({ page }) => {
    await page.goto("/intro");
    await page.getByRole("button", { name: /Skip|Enter Archive411/i }).first().click();
    await expect(page).toHaveURL(/\/auth/);
    await signUp(page, email);
    await expect(page.getByText(/Home|Discovery/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("Build My Look → generate lookbook", async ({ page }) => {
    await signIn(page, email);
    await completeBuildFlow(page);
    lookbookUrl = page.url();
    await expect(page.getByRole("button", { name: /Save to My Archive/i })).toBeVisible();
  });

  test("replace item → save to archive", async ({ page }) => {
    await signIn(page, email);
    await page.goto(lookbookUrl || "/build");
    if (!lookbookUrl) {
      await completeBuildFlow(page);
      lookbookUrl = page.url();
    }

    const replaceBtn = page.getByRole("button", { name: "Replace item" }).first();
    if (await replaceBtn.isVisible()) {
      await replaceBtn.click();
      await expect(replaceBtn).not.toHaveText("Replacing...", { timeout: 15000 });
    }

    await page.getByRole("button", { name: /Save to My Archive/i }).first().click();
    await expect(page.getByText(/Saved to My Archive|Saved on this device/i).first()).toBeVisible({
      timeout: 15000,
    });
  });

  test("archive persists after refresh", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/archive");
    await expect(page.getByText(/My Archive|Your fashion library/i).first()).toBeVisible();
    const savedCard = page.locator('a[href*="/lookbooks/"]').first();
    await expect(savedCard).toBeVisible({ timeout: 15000 });
    await page.reload();
    await expect(savedCard).toBeVisible({ timeout: 15000 });
  });

  test("sign out → sign in → archive still there", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/archive");
    await expect(page.locator('a[href*="/lookbooks/"]').first()).toBeVisible({ timeout: 15000 });
    await signOut(page);
    await signIn(page, email);
    await page.goto("/archive");
    await expect(page.locator('a[href*="/lookbooks/"]').first()).toBeVisible({ timeout: 15000 });
  });

  test("search returns lookbook", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/search");
    await page.getByRole("button", { name: "Search looks" }).first().click();
    await page.waitForURL(/\/lookbooks\/|\/search/, { timeout: 60000 });
    if (page.url().includes("/lookbooks/")) {
      await expect(page.getByRole("button", { name: /Save to My Archive/i })).toBeVisible();
    }
  });

  test("surprise me loads lookbook", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/surprise");
    await page.waitForURL(/\/lookbooks\//, { timeout: 60000 });
    await expect(page.getByRole("button", { name: /Save to My Archive/i })).toBeVisible();
  });

  test("collections page — create collection", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/collections");
    const name = `QA Collection ${Date.now()}`;
    await page.getByPlaceholder("New collection name").fill(name);
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText(name)).toBeVisible({ timeout: 15000 });
  });

  test("designers browse", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/designers");
    await expect(page.getByRole("heading").first()).toBeVisible();
    const designerLink = page.locator('a[href^="/designers/"]').first();
    await expect(designerLink).toBeVisible({ timeout: 15000 });
    await designerLink.click();
    await expect(page).toHaveURL(/\/designers\//);
  });
});

test.describe("Coming soon — not clickable", () => {
  test.beforeEach(async ({ page }) => {
    await skipIntro(page);
    await page.goto("/home");
  });

  test("Quick Generate in create menu is disabled", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Create" }).click();
    const quickGenerate = page.getByText("Quick Generate");
    await expect(quickGenerate).toBeVisible();
    await quickGenerate.click({ force: true });
    await expect(page).not.toHaveURL(/\/generate/);
  });

  test("designer save/follow buttons are disabled", async ({ page }) => {
    await page.goto("/designers");
    const link = page.locator('a[href^="/designers/"]').first();
    await link.click();
    await expect(page.getByRole("button", { name: /Save designer \(soon\)/i })).toBeDisabled();
    await expect(page.getByRole("button", { name: /Follow designer \(soon\)/i })).toBeDisabled();
  });
});
