import { expect, test, type Page } from '@playwright/test';

async function signIn(page: Page, email = 'demo@example.com') {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
}

test('landing → sign in → create a task → change the theme', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /get started/i }).click();
  await expect(page).toHaveURL(/\/login$/);

  await signIn(page);

  await page.getByRole('link', { name: 'Tasks' }).first().click();
  await page.getByRole('button', { name: /new task/i }).click();
  await page.getByRole('dialog').getByLabel('Title').fill('E2E task');
  await page
    .getByRole('dialog')
    .getByRole('button', { name: /create/i })
    .click();
  await expect(page.getByRole('link', { name: 'E2E task' })).toBeVisible();

  await page.getByRole('link', { name: 'Settings' }).first().click();
  await page.getByRole('button', { name: /violet/i }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'violet');

  // The theme survives a reload (applied before React boots).
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'violet');
});

test('command menu navigates and runs actions', async ({ page }) => {
  await signIn(page);

  await page.keyboard.press('Control+k');
  await page.getByPlaceholder(/search or jump/i).fill('create a task');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/app\/tasks\?new=1/);
  await expect(page.getByRole('dialog', { name: /new task/i })).toBeVisible();
});

test('members do not see admin-only pages', async ({ page }) => {
  await signIn(page, 'member@example.com');
  await expect(page.getByRole('link', { name: 'Users' })).toHaveCount(0);

  await page.goto('/app/users');
  await expect(page.getByText(/you don't have access/i)).toBeVisible();
});
