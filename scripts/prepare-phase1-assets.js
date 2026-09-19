const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '..');
  const publicUiDir = path.join(root, 'public', 'ui');
  const publicCharV2Faces = path.join(root, 'public', 'character', 'v2', 'faces');
  const publicCharV2Poses = path.join(root, 'public', 'character', 'v2', 'poses');

  // Ensure directories exist (T001)
  for (const dir of [publicUiDir, publicCharV2Faces, publicCharV2Poses]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Created directory:', dir);
    }
  }

  // Process faces from chatgbt-uiux/fares-faces/ (T002)
  const faresFacesDir = path.join(root, 'chatgbt-uiux', 'fares-faces');
  if (fs.existsSync(faresFacesDir)) {
    const faceFiles = fs.readdirSync(faresFacesDir).filter(f => f.endsWith('.png'));
    let idx = 1;
    for (const file of faceFiles) {
      const srcPath = path.join(faresFacesDir, file);
      const destWebp = path.join(publicCharV2Faces, `fares-face-sheet-${idx}.webp`);
      const destThumb = path.join(publicCharV2Faces, `fares-face-sheet-${idx}-thumb.webp`);

      // Optimize full resolution webp
      await sharp(srcPath)
        .webp({ quality: 85 })
        .toFile(destWebp);

      // Create a thumbnail / compact avatar version
      await sharp(srcPath)
        .resize(384, 256, { fit: 'inside' })
        .webp({ quality: 80 })
        .toFile(destThumb);

      console.log(`Processed face sheet ${idx}: ${file} -> ${destWebp}`);
      idx++;
    }
  }

  // Optimize and copy key UI backgrounds/cards from chatgbt-uiux/pages/ into public/ui/
  const pagesDir = path.join(root, 'chatgbt-uiux', 'pages');
  if (fs.existsSync(pagesDir)) {
    const pageFiles = [
      'login-phone.png',
      'login-website.png',
      'home-phone.png',
      'home-website.png',
      'workout-phone.png',
      'workout-website.png'
    ];

    for (const file of pageFiles) {
      const srcPath = path.join(pagesDir, file);
      if (fs.existsSync(srcPath)) {
        const destWebp = path.join(publicUiDir, file.replace('.png', '.webp'));
        await sharp(srcPath)
          .webp({ quality: 80 })
          .toFile(destWebp);
        console.log(`Created optimized reference asset: ${destWebp}`);
      }
    }
  }

  console.log('Asset preparation complete.');
}

main().catch(err => {
  console.error('Error preparing assets:', err);
  process.exit(1);
});
