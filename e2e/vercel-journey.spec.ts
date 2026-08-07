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

  test("Build My Look → shows lookbook results", async ({ page }) => {
    await signIn(page, email);
    await completeBuildFlow(page);
    await expect(page).toHaveURL(/\/lookbooks\//);
    await expect(page.getByRole("button", { name: /Shop now/i }).first()).toBeVisible({
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

  test("search opens lookbook results", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/search");
    await page.getByRole("button", { name: "Search looks" }).first().click();
    await page.waitForURL(/\/lookbooks\//, { timeout: 60000 });
    await expect(page.getByText(/Lookbook/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("surprise me opens lookbook after save", async ({ page }) => {
    await signIn(page, email);
    await page.goto("/surprise");
    await page.getByRole("button", { name: /Surprise me/i }).click();
    await page.getByRole("button", { name: /Save to Archive/i }).click();
    await page.waitForURL(/\/lookbooks\//, { timeout: 60000 });
    await expect(page.getByText(/Lookbook/i).first()).toBeVisible({ timeout: 15000 });
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
