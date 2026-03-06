const fs = require('fs');
const puppeteer = require('puppeteer-core');

const URL = process.env.TEST_URL || 'http://localhost:3000/';
const TIMEOUT = 90_000; // 90s

(async () => {
  console.log('Launching headless browser...');
  // Detect Chrome/Chromium executable path (Windows common locations)
  const exeFromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  const commonPaths = [
    exeFromEnv,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome SxS\\Application\\chrome.exe',
    'C:\\Program Files\\Chromium\\Application\\chrome.exe'
  ].filter(Boolean);

  let executablePath = null;
  for (const p of commonPaths) {
    try { if (fs.existsSync(p)) { executablePath = p; break; } } catch (e) {}
  }

  if (!executablePath) {
    console.warn('Chrome executable not found in common paths. Set PUPPETEER_EXECUTABLE_PATH env var to the browser path.');
  } else {
    console.log('Using Chrome executable:', executablePath);
  }

  const launchOptions = { headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] };
  if (executablePath) launchOptions.executablePath = executablePath;

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  const logs = [];

  page.on('console', msg => {
    try {
      const text = msg.text();
      logs.push({ type: msg.type(), text, location: msg.location ? msg.location() : null });
      process.stdout.write(`[page] ${text}\n`);
    } catch (e) {
      // ignore
    }
  });

  page.on('pageerror', err => {
    logs.push({ type: 'pageerror', text: err.message });
    console.error('Page error:', err.message);
  });

  console.log('Navigating to', URL);
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 }).catch(err => {
    console.error('Navigation error:', err.message);
  });

  // Import and run the module-based test runner inside the page context
  try {
    await page.evaluate(async () => {
      try {
        const mod = await import('/test/gameTester.js');
        if (mod && typeof mod.runAllTests === 'function') {
          const results = await mod.runAllTests();
          // Expose results to outer context
          window.testResults = results;
        } else {
          console.warn('runAllTests not found in module');
        }
      } catch (err) {
        console.error('Error running tests in page context:', err.message || err);
      }
    });
    console.log('Triggered in-page test runner');
  } catch (e) {
    console.warn('Could not run in-page test runner:', e.message);
  }

  // Wait until window.testResults or window.bugReport is available or timeout
  const result = await page.evaluate((timeout) => {
    return new Promise((resolve) => {
      const start = Date.now();
      function check() {
        if (window.testResults) return resolve({ source: 'testResults', value: window.testResults });
        if (window.bugReport) return resolve({ source: 'bugReport', value: window.bugReport });
        if (Date.now() - start > timeout) return resolve({ source: 'timeout', value: null });
        setTimeout(check, 500);
      }
      check();
    });
  }, TIMEOUT);

  const out = {
    meta: {
      url: URL,
      timestamp: new Date().toISOString()
    },
    logs,
    result
  };

  fs.writeFileSync('test/puppeteer-report.json', JSON.stringify(out, null, 2));

  // Create human-readable summary
  let summary = `# Relatório de Testes (Puppeteer)\n\n`;
  summary += `URL: ${URL}\n`;
  summary += `Data: ${out.meta.timestamp}\n\n`;

  if (result && result.value) {
    const r = result.value;
    const bugs = r.bugs ? r.bugs.length : 0;
    const errors = r.errors ? r.errors.length : 0;
    const warnings = r.warnings ? r.warnings.length : 0;
    const passed = r.passed ? r.passed.length : 0;

    summary += `- ✅ Passed: ${passed}\n`;
    summary += `- ❌ Errors: ${errors}\n`;
    summary += `- 🐛 Bugs: ${bugs}\n`;
    summary += `- ⚠️ Warnings: ${warnings}\n\n`;

    if (bugs > 0) {
      summary += `## Bugs\n`;
      r.bugs.forEach((b, i) => {
        summary += `${i + 1}. ${b.title} - ${b.severity || 'UNKNOWN'}\n   ${b.description}\n\n`;
      });
    }
  } else {
    summary += 'Nenhum resultado de teste detectado (timeout ou falha).\n\n';
  }

  fs.writeFileSync('test/TEST_REPORT_PUPPETEER.md', summary);

  console.log('Report saved to test/puppeteer-report.json and test/TEST_REPORT_PUPPETEER.md');

  await browser.close();
  process.exit(0);
})();
