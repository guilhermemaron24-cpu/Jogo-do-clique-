const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function gen(filePath, duration = 0.6) {
  const ffmpeg = require('ffmpeg-static');
  const out = filePath;
  const args = [
    '-y',
    '-f', 'lavfi',
    '-i', `anullsrc=channel_layout=mono:sample_rate=22050`,
    '-t', String(duration),
    '-q:a', '9',
    out
  ];
  const res = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (res.error) throw res.error;
}

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });
const files = ['boss-appear.mp3','boss-hit.mp3','boss-defeat.mp3'];
files.forEach(f => {
  const p = path.join(soundsDir, f);
  try {
    gen(p, 0.6);
    console.log('Generated', p);
  } catch (e) {
    console.error('Failed', p, e);
  }
});
console.log('Done');
