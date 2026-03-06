const path = require('path');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');

function gen(filePath, freq, duration, q=6) {
  const args = [
    '-y',
    '-f', 'lavfi',
    '-i', `sine=frequency=${freq}:sample_rate=44100:duration=${duration}`,
    '-q:a', String(q),
    filePath
  ];
  const res = spawnSync(ffmpeg, args, { stdio: 'inherit' });
  if (res.error) throw res.error;
}

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });

try {
  gen(path.join(soundsDir, 'boss-appear.mp3'), 360, 0.7, 5); // warm ascending feel
  gen(path.join(soundsDir, 'boss-hit.mp3'), 1200, 0.15, 3); // sharp hit
  gen(path.join(soundsDir, 'boss-defeat.mp3'), 180, 0.9, 5); // low defeat tone
  console.log('Generated audible MP3s in', soundsDir);
} catch (e) {
  console.error('Failed to generate sounds:', e);
  process.exit(1);
}
