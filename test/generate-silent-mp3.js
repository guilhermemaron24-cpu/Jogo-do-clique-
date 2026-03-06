const fs = require('fs');
const path = require('path');
const lamejs = require('lamejs');

function generateSilentMp3(filePath, durationSec = 0.6, sampleRate = 22050) {
  const samples = Math.floor(durationSec * sampleRate);
  // create silence PCM (Int16)
  const pcm = new Int16Array(samples);
  for (let i = 0; i < samples; i++) pcm[i] = 0;

  const mp3enc = new lamejs.Mp3Encoder(1, sampleRate, 128);
  const maxSamples = 1152;
  let mp3Data = [];
  for (let i = 0; i < pcm.length; i += maxSamples) {
    const chunk = pcm.subarray(i, i + maxSamples);
    const mp3buf = mp3enc.encodeBuffer(chunk);
    if (mp3buf.length > 0) mp3Data.push(Buffer.from(mp3buf));
  }
  const endBuf = mp3enc.flush();
  if (endBuf.length > 0) mp3Data.push(Buffer.from(endBuf));

  const out = Buffer.concat(mp3Data);
  fs.writeFileSync(filePath, out);
  console.log('Wrote', filePath, 'size', out.length);
}

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });

const files = ['boss-appear.mp3', 'boss-hit.mp3', 'boss-defeat.mp3'];
files.forEach(f => generateSilentMp3(path.join(soundsDir, f)));
console.log('All done');
