aconst puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');

(async () => {
  try {
    const chromePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];
    const executablePath = chromePaths.find(p => fs.existsSync(p));
    if (!executablePath) throw new Error('Chrome not found on standard paths');

    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 800 });

    console.log('Navigating to http://localhost:3000/');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 15000 });

    // ensure game initialized
    await page.waitForTimeout(800);
    await page.mouse.click(50,50);
    await page.waitForTimeout(200);

    // prepare frames folder
    const framesDir = path.join(__dirname, 'record_frames');
    if (fs.existsSync(framesDir)) fs.rmSync(framesDir, { recursive: true, force: true });
    fs.mkdirSync(framesDir, { recursive: true });

    // start boss and record
    console.log('Starting boss encounter and recording frames...');
    await page.evaluate(() => { window.__demoStarted = true; });
    await page.evaluate(async () => {
      const mod = await import('/utils/bossManager.js');
      mod.startBossForSector(3, (res) => { console.log('boss cb', res); }, { scale: 1, targetLifetime: 3000 });
    });

    const duration = 3000; // ms (3s)
    const interval = 80; // ms -> ~12.5 fps
    const start = Date.now();
    let idx = 0;
    while (Date.now() - start < duration) {
      const filename = path.join(framesDir, `frame${String(idx).padStart(3,'0')}.png`);
      await page.screenshot({ path: filename });
      idx++;
      await page.waitForTimeout(interval);
    }

    await browser.close();

    // assemble with ffmpeg
    const out = path.join(__dirname, 'boss-demo.mp4');
    const args = [
      '-y',
      '-framerate', '10',
      '-i', path.join(framesDir, 'frame%03d.png'),
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-vf', "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      out
    ];
    console.log('Running ffmpeg to create MP4...');
    const res = spawnSync(ffmpeg, args, { stdio: 'inherit' });
    if (res.error) throw res.error;

    console.log('Demo video generated at', out);
    process.exit(0);
  } catch (e) {
    console.error('Error recording demo:', e);
    process.exit(1);
  }
})();
