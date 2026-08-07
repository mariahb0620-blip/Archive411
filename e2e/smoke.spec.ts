import { test, expect } from "@playwright/test";

test("intro page loads", async ({ page }) => {
  await page.goto("/intro");
  await expect(page.getByRole("heading")).toBeVisible();
});

test("auth page loads", async ({ page }) => {
  await page.goto("/auth");
  await expect(page.getByText(/Enter your Archive/i)).toBeVisible();
});

test("home redirects through guard or loads", async ({ page }) => {
  await page.goto("/home");
  await expect(page).toHaveURL(/\/(home|intro|auth)/);
});
