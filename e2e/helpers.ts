import type { Page } from "@playwright/test";

export const TEST_PASSWORD = "TestPass123!";

export function testEmail(prefix: string) {
  return `${prefix}-${Date.now()}@archive411.test`;
}

export async function skipIntro(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("archive411-onboarding", "true");
  });
}

export async function signUp(page: Page, email: string, name = "QA Tester") {
  await page.goto("/auth");
  await page.getByRole("button", { name: /Create account with email/i }).click();
  await page.getByPlaceholder("Your name").fill(name);
  await page.getByPlaceholder("you@email.com").fill(email);
  await page.getByPlaceholder("Minimum 8 characters").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /Create account/i }).click();
  await page.waitForURL(/\/home/, { timeout: 30000 });
}

export async function signIn(page: Page, email: string) {
  await page.goto("/auth");
  await page.getByRole("button", { name: /Sign in with email/i }).click();
  await page.getByPlaceholder("you@email.com").fill(email);
  await page.getByPlaceholder("Minimum 8 characters").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /^Sign in$/i }).click();
  await page.waitForURL(/\/home/, { timeout: 30000 });
}

export async function signOut(page: Page) {
  await page.goto("/profile");
  await page.getByRole("button", { name: /Sign out/i }).click();
  await page.waitForURL(/\/(auth|intro|home)/, { timeout: 15000 });
}

export async function completeBuildFlow(page: Page) {
  await page.goto("/build");
  await page.getByRole("button", { name: "Y2K" }).click();
  await page.getByRole("button", { name: "Hot-Girl Y2K" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Feminine" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Date night" }).click();
  await page.getByRole("button", { name: "New York" }).click();
  await page.getByRole("button", { name: "Summer" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: /Yes, include shoes/i }).click();
  await page.getByRole("button", { name: "Generate lookbook" }).click();
  await page.waitForURL(/\/lookbooks\//, { timeout: 60000 });
}
