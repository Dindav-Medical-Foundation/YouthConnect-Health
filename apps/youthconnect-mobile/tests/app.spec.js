const { test, expect } = require('@playwright/test');

test.describe('YouthConnect Web App', () => {
  test('should load the home screen and navigate to consultation', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=YouthConnect Health')).toBeVisible({ timeout: 60000 });
    await page.waitForTimeout(500); 
    await page.screenshot({ path: 'home_screen.png' });

    await page.locator('text=Consultation').click();

    await expect(page.locator('text=Available Doctors')).toBeVisible();
    await expect(page.locator('text=Dr. Anya Sharma')).toBeVisible();
    await expect(page.locator('text=Dr. Benjamin Lee')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'consultation_screen.png' });
  });

  test('should navigate to chatbot screen and send message', async ({ page }) => {
    await page.goto('/');

    await page.locator('text=Chat Nurse').click();

    await expect(page.locator('text=Hi David!')).toBeVisible();

    await page.getByPlaceholder('Type your medical question here...').fill('What are the symptoms of flu?');
    
    await page.locator('text=Send').click();

    await expect(page.locator('text=What are the symptoms of flu?')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'chatbot_screen.png' });
  });

  test('should navigate to Family Planning screen', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Family Quiz').click();
    await expect(page.locator('text=Are you sexually active?')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'family_planning_screen.png' });
  });

  test('should navigate to Emergency Help screen', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Emergency').click();
    await expect(page.locator('text=Post-rape care')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'emergency_help_screen.png' });
  });
});
