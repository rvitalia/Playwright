const { chromium, webkit, firefox, devices } = require('@playwright/test');
const iPhone11Pro = devices['iPhone 11 Pro'];


(async () => {
  for (const browserType of [webkit, chromium, firefox]) {//перебираем по всем браузерам

    for (const url of ['https://abrosko-studio.ru/']) {
      const browser = await browserType.launch({
        headless: false,
      });//запускаем браузер
      //получаем название страницы
      let nameofpage = url.substring(url.lastIndexOf('/') + 1, url.length - 1);
      const page = await browser.newPage();//открываем страницу
      await page.goto(url, { timeout: 30000 });// переходим на страницу
      await page.waitForSelector('.activesmall');
      // await page.waitForNavigation();
      await page.evaluate(() => {
        const particles = document.querySelector('#particles-js');
        if (particles) {
          particles.style.display = 'none';
        }
      });
      //если главная страница, то не даем добавить слэш, чтоб не получился уход в глубину...
      if (nameofpage == '/') {
        await page.screenshot({ path: `mytest/screenshot${browserType.name()}.png`, fullPage: true });
      }
      else {
        await page.screenshot({ path: `mytest/screenshot${nameofpage}-${browserType.name()}.png`, fullPage: true });
      }
      await browser.close();//закрываем браузер
      console.log(`success: ` + nameofpage + browserType.name());//выводим сообщение в консоль

      if (browserType != firefox) {
        const browsermobile = await browserType.launch({
          headless: false,
        });//запускаем браузер
        const contextmobile = await browsermobile.newContext({
          ...iPhone11Pro,
        });
        contextmobile.setDefaultTimeout(150000);
        const pagemobile = await contextmobile.newPage();//открываем страницу
        await pagemobile.goto(url, { timeout: 30000 });// переходим на страницу
        await pagemobile.waitForSelector('.activesmall');
        await pagemobile.evaluate(() => {
          const particles = document.querySelector('#particles-js');
          if (particles) {
            particles.style.display = 'none';
          }
        });
        if (nameofpage == '/') {
          await pagemobile.screenshot({ path: `mytest/screenshotmobile${browserType.name()}.png`, fullPage: true });
        }
        else {
          await pagemobile.screenshot({ path: `mytest/screenshotmobile${nameofpage}-${browserType.name()}.png`, fullPage: true });
        }
        await contextmobile.close();// закрываем контекст
        await browsermobile.close();//закрываем браузер
        console.log(`successmobile: ` + url + browserType.name());//выводим сообщение в консоль
      }

      // 'https://abrosko-studio.ru/news/', 'https://abrosko-studio.ru/blog/', 'https://abrosko-studio.ru/yandex-plus/'
    }
  }
})();