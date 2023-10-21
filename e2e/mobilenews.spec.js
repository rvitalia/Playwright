// @ts-check
const { selectors, test, expect, devices, defineConfig } = require('@playwright/test');
const { describe } = require('node:test');
const iPhone11Pro = devices['iPhone 11 Pro'];


test.describe.configure({ timeout: 250000 });
test('desktop test ', async ({ browser, browserName }) => {
    test.fail(browserName === 'firefox', 'Ismobile not supported');
    const context = await browser.newContext({
        ...iPhone11Pro,
    });
  const url = 'https://abrosko-studio.ru/news/';
  const page = await context.newPage();//открываем страницу
  await page.goto(url);
  // await page.waitForSelector('.activesmall');
  await page.waitForLoadState('networkidle'); //ждем пока не будет передачи по сети
  await page.evaluate(() => {
    const particles = document.querySelector('#particles-js');
    if (particles) {
      particles.style.display = 'none';
    }
  });
  // Проверяем, чтобы страница имела в заголовке Playwright
  await expect(page).toHaveTitle(/ABrosko/);
  //проверрем фреймы
  const arrayClasses = ['.news', '.header', '.footer'];
  for (const iterator of arrayClasses) {
    const element = await page.$(iterator);
    const boundingBox = await element?.boundingBox();
    await expect(page).toHaveScreenshot({ fullPage: true, clip: boundingBox, timeout: 20000 });
    // сменяем активный таб
    await page.getByRole('button', { name: 'Short news' }).click();
    await expect(page).toHaveScreenshot({ fullPage: true, clip: boundingBox, timeout: 20000 });
  }

  //закрываем контекст и браузер
  await context.close();
  await browser.close();
});

// await page.getByRole('button', { name: 'Оформить заказ' }).all()[0].click();
// await page.getByAltText('cancel').click();
