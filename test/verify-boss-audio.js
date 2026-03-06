const puppeteer = require('puppeteer-core');
const path = require('path');

(async () => {
  try {
    const chromePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];
    let executablePath = chromePaths.find(p => require('fs').existsSync(p));

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    page.on('console', msg => {
      try {
        const text = msg.text();
        console.log('[page]', text);
      } catch (e) {}
    });

    console.log('Navigating to http://localhost:3000/');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 10000 });

    // Ensure minimal wait for game init
    await page.waitForTimeout(1500);

    // Simulate a user gesture to allow audio context resume
    await page.mouse.click(50, 50);
    await page.waitForTimeout(200);

    console.log('Importing bossManager and starting boss for sector 3');
    const result = await page.evaluate(async () => {
      try {
        const mod = await import('/utils/bossManager.js');
        return await new Promise(resolve => {
          mod.startBossForSector(3, (res) => {
            resolve({ cb: res, ok: true });
          }, { scale: 1 });
          // resolve after a timeout if callback doesn't call
          setTimeout(() => resolve({ cb: null, ok: 'timeout' }), 4000);
        });
      } catch (e) {
        return { error: String(e) };
      }
    });

    console.log('Result from page.evaluate:', result);

    // wait a bit to capture audio logs
    await page.waitForTimeout(2000);

    await browser.close();
    console.log('Finished verification script');
    process.exit(0);
  } catch (e) {
    console.error('Error in verify script:', e);
    process.exit(1);
  }
})();
