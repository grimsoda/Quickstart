import { test, expect } from "@playwright/test";

test("home renders and mode switch works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Quickstart")).toBeVisible();
  await page.getByRole("button", { name: "Decide" }).click();
  await expect(page.getByText("Decide mode")).toBeVisible();
  await page.getByRole("button", { name: "Drift" }).click();
  await expect(page.getByText("Drift mode")).toBeVisible();
});

test("editor shows add item", async ({ page }) => {
  await page.goto("/editor");
  await expect(page.getByRole("button", { name: "Add item" })).toBeVisible();
});

test("settings export button exists", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByRole("button", { name: "Export JSON" })).toBeVisible();
});
