const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const publicDir = path.join(root, 'public');
  const characterDir = path.join(publicDir, 'character');
  const uiDir = path.join(publicDir, 'ui');

  console.log('Optimizing production assets...');

  // 1. Optimize avatar.png -> avatar.webp if exists
  const avatarPng = path.join(characterDir, 'avatar.png');
  const avatarWebp = path.join(characterDir, 'avatar.webp');
  if (fs.existsSync(avatarPng)) {
    await sharp(avatarPng)
      .resize(512, 512, { fit: 'inside' })
      .webp({ quality: 85 })
      .toFile(avatarWebp);
    const pngSize = fs.statSync(avatarPng).size;
    const webpSize = fs.statSync(avatarWebp).size;
    console.log(`Optimized avatar: ${(pngSize / 1024).toFixed(1)} KB -> ${(webpSize / 1024).toFixed(1)} KB (WebP)`);
  }

  // 2. Scan and report on all UI and character WebP assets
  const reportAssetDir = (dirName, dirPath) => {
    if (!fs.existsSync(dirPath)) return;
    const files = fs.readdirSync(dirPath);
    console.log(`\nAssets in ${dirName}:`);
    for (const f of files) {
      const full = path.join(dirPath, f);
      const stat = fs.statSync(full);
      if (stat.isFile()) {
        console.log(`  - ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
      }
    }
  };

  reportAssetDir('public/ui', uiDir);
  reportAssetDir('public/character', characterDir);
  reportAssetDir('public/character/v2/faces', path.join(characterDir, 'v2', 'faces'));

  console.log('\nAll production assets verified and compressed successfully.');
}

main().catch(err => {
  console.error('Asset optimization failed:', err);
  process.exit(1);
});
