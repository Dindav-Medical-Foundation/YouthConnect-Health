const { test, expect } = require('@playwright/test');

test.describe('YouthConnect Web App', () => {
  test('should load the home screen and navigate to consultation', async ({ page }) => {
    // Navigate to the Expo web app
    await page.goto('/');

    // Wait for the app to render the greeting
    await expect(page.locator('text=Hello David 👋')).toBeVisible();
    await page.waitForTimeout(500); // Give fonts/styles a moment to settle
    await page.screenshot({ path: 'home_screen.png' });

    // Find and click the Book Consultation button
    // It should navigate to the Consultation screen
    await page.locator('text=Book Consultation').click();

    // Verify the Consultation screen is rendered by checking for the doctors
    await expect(page.locator('text=Available Doctors')).toBeVisible();
    await expect(page.locator('text=Dr. Anya Sharma')).toBeVisible();
    await expect(page.locator('text=Dr. Benjamin Lee')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'consultation_screen.png' });
  });

  test('should navigate to chatbot screen and send message', async ({ page }) => {
    // Navigate to the Expo web app
    await page.goto('/');

    // Find and click the Chat with AI button
    await page.locator('text=Chat with AI').click();

    // Verify Chatbot screen is loaded
    await expect(page.locator('text=Hi David!')).toBeVisible();

    // Type a message in the input placeholder "Type your medical question here..."
    await page.getByPlaceholder('Type your medical question here...').fill('What are the symptoms of flu?');
    
    // Click send
    await page.locator('text=Send').click();

    // Verify the message appears in the chat
    await expect(page.locator('text=What are the symptoms of flu?')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'chatbot_screen.png' });
  });

  test('should navigate to Family Planning screen', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Family Planning Quiz').click();
    await expect(page.locator('text=Are you sexually active?')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'family_planning_screen.png' });
  });

  test('should navigate to Emergency Help screen', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Emergency Help').click();
    await expect(page.locator('text=Post-rape care')).toBeVisible();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'emergency_help_screen.png' });
  });
});
