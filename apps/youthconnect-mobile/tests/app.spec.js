const { test, expect } = require('@playwright/test');

test.describe('YouthConnect Chatbot Screen', () => {
  test('should load and allow chatting with Keren', async ({ page }) => {
    // Navigate to the chatbot tab URL (react-native-web app)
    await page.goto('/');

    // Click the "Chatbot" tab to switch screens
    const chatbotTab = page.locator('text=Chatbot').first();
    await expect(chatbotTab).toBeVisible();
    await chatbotTab.click();

    // Wait for the chatbot screen to mount and show the welcome bubble (substring search)
    const welcome = page.locator('text=Keren, your Health Assistant');
    await expect(welcome).toBeVisible({ timeout: 15000 });

    // Find the chat TextInput placeholder "Ask a health question..."
    const input = page.locator('[placeholder="Ask a health question..."]');
    await expect(input).toBeVisible();

    // Type a keyword query and submit it
    await input.fill('tell me about family planning');
    
    // Find and click the Send button
    const sendButton = page.locator('text=Send');
    await sendButton.click();

    // Verify the user message is echoed on screen (substring search)
    const userMsg = page.locator('text=family planning').last();
    await expect(userMsg).toBeVisible();

    // Verify that Keren matches contraception guidelines and displays them (substring search)
    const aiResponse = page.locator('text=Contraception & Safe Sex Practices');
    await expect(aiResponse).toBeVisible({ timeout: 15000 });

    // Test the "Clear Chat" feature
    const clearButton = page.locator('text=Clear Chat');
    await expect(clearButton).toBeVisible();
    await clearButton.click();

    // The user message and AI response bubbles should be cleared from view
    await expect(userMsg).not.toBeVisible();
    await expect(aiResponse).not.toBeVisible();
  });
});
