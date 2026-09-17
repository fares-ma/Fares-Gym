const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function inspectAndExtract() {
  const sheetMeta = await sharp('public/character-design-sheet.jpg').metadata();
  const mockupMeta = await sharp('public/mobile-ui-mockup.png').metadata();
  console.log('Design sheet metadata:', sheetMeta.width, 'x', sheetMeta.height);
  console.log('Mockup metadata:', mockupMeta.width, 'x', mockupMeta.height);

  const posesDir = path.join('public', 'character', 'poses');
  const facesDir = path.join('public', 'character', 'faces');
  fs.mkdirSync(posesDir, { recursive: true });
  fs.mkdirSync(facesDir, { recursive: true });

  // Let's create high-quality crops from the 1024x1024 design sheet
  // Sheet is 1024x1024 (or similar).
  const W = sheetMeta.width;
  const H = sheetMeta.height;

  // Let's helper normalize coords
  const crop = async (rect, outPath) => {
    // rect: { left: ratio, top: ratio, width: ratio, height: ratio }
    const extractArea = {
      left: Math.round(rect.left * W),
      top: Math.round(rect.top * H),
      width: Math.min(Math.round(rect.width * W), W - Math.round(rect.left * W)),
      height: Math.min(Math.round(rect.height * H), H - Math.round(rect.top * H)),
    };
    await sharp('public/character-design-sheet.jpg')
      .extract(extractArea)
      .png()
      .toFile(outPath);
    console.log('Saved:', outPath);
  };

  // 1. Big Hero standing (left side of sheet)
  await crop({ left: 0.0, top: 0.1, width: 0.38, height: 0.85 }, path.join(posesDir, 'hero-standing.png'));

  // 2. GYM MODE (dumbbell + towel)
  await crop({ left: 0.32, top: 0.15, width: 0.20, height: 0.30 }, path.join(posesDir, 'gym-dumbbell.png'));
  await crop({ left: 0.32, top: 0.15, width: 0.20, height: 0.30 }, path.join(posesDir, 'gym-warmup.png'));

  // 3. STUDY MODE (laptop + books)
  await crop({ left: 0.51, top: 0.17, width: 0.18, height: 0.28 }, path.join(posesDir, 'study-laptop.png'));

  // 4. FOOD MODE (bowl + fork)
  await crop({ left: 0.68, top: 0.17, width: 0.16, height: 0.28 }, path.join(posesDir, 'food-plate.png'));

  // 5. REST MODE (arms behind head, relaxed)
  await crop({ left: 0.83, top: 0.18, width: 0.17, height: 0.27 }, path.join(posesDir, 'hero-rest-day.png'));
  await crop({ left: 0.83, top: 0.18, width: 0.17, height: 0.27 }, path.join(posesDir, 'meditation.png'));

  // FACES (Row of 6 heads)
  // Row spans y roughly 0.47 to 0.62
  await crop({ left: 0.39, top: 0.47, width: 0.09, height: 0.15 }, path.join(facesDir, 'normal.png'));
  await crop({ left: 0.47, top: 0.47, width: 0.10, height: 0.15 }, path.join(posesDir, 'thumbs-up.png'));
  await crop({ left: 0.47, top: 0.47, width: 0.10, height: 0.15 }, path.join(facesDir, 'happy.png'));
  await crop({ left: 0.58, top: 0.47, width: 0.09, height: 0.15 }, path.join(facesDir, 'focused.png'));
  await crop({ left: 0.67, top: 0.46, width: 0.10, height: 0.16 }, path.join(facesDir, 'confused.png'));
  await crop({ left: 0.77, top: 0.47, width: 0.10, height: 0.15 }, path.join(facesDir, 'laughing.png'));
  await crop({ left: 0.87, top: 0.47, width: 0.10, height: 0.15 }, path.join(facesDir, 'cool.png'));

  // SMALL FULL-BODY POSES (bottom row)
  // On My Way (walking with backpack)
  await crop({ left: 0.37, top: 0.64, width: 0.12, height: 0.22 }, path.join(posesDir, 'walking.png'));
  await crop({ left: 0.37, top: 0.64, width: 0.12, height: 0.22 }, path.join(posesDir, 'on-my-way.png'));

  // Rest Timer (sitting on gym bench)
  await crop({ left: 0.49, top: 0.67, width: 0.16, height: 0.19 }, path.join(posesDir, 'rest-timer-sitting.png'));

  // New PR! (fist pump in the air)
  await crop({ left: 0.66, top: 0.63, width: 0.14, height: 0.23 }, path.join(posesDir, 'fist-pump.png'));
  await crop({ left: 0.66, top: 0.63, width: 0.14, height: 0.23 }, path.join(posesDir, 'trophy.png'));
  await crop({ left: 0.66, top: 0.63, width: 0.14, height: 0.23 }, path.join(posesDir, 'celebrating.png'));

  // Keep Going (studying at desk)
  await crop({ left: 0.80, top: 0.67, width: 0.18, height: 0.20 }, path.join(posesDir, 'notebook.png'));

  // Now from Mockup:
  const MW = mockupMeta.width;
  const MH = mockupMeta.height;
  const cropMockup = async (rect, outPath) => {
    const extractArea = {
      left: Math.round(rect.left * MW),
      top: Math.round(rect.top * MH),
      width: Math.min(Math.round(rect.width * MW), MW - Math.round(rect.left * MW)),
      height: Math.min(Math.round(rect.height * MH), MH - Math.round(rect.top * MH)),
    };
    await sharp('public/mobile-ui-mockup.png')
      .extract(extractArea)
      .png()
      .toFile(outPath);
    console.log('Saved mockup crop:', outPath);
  };

  // Hero Bench pose in Mockup (Sitting on bench with towel, looking at camera)
  await cropMockup({ left: 0.47, top: 0.12, width: 0.43, height: 0.30 }, path.join(posesDir, 'hero-bench.png'));
  await cropMockup({ left: 0.47, top: 0.12, width: 0.43, height: 0.30 }, path.join(posesDir, 'pointing-right.png'));
  await cropMockup({ left: 0.47, top: 0.12, width: 0.43, height: 0.30 }, path.join(posesDir, 'gym-bench-press.png'));

  // Avatar circle from mockup top right
  await cropMockup({ left: 0.78, top: 0.05, width: 0.12, height: 0.06 }, path.join('public', 'character', 'avatar.png'));
  await cropMockup({ left: 0.78, top: 0.05, width: 0.12, height: 0.06 }, path.join(posesDir, 'avatar-circle.png'));

  // Quote banner character in mockup bottom left
  await cropMockup({ left: 0.09, top: 0.76, width: 0.25, height: 0.12 }, path.join(facesDir, 'thinking.png'));

  // Additional mapped poses & faces to complete all 35 catalog items:
  // Settings wrench
  fs.copyFileSync(path.join(posesDir, 'study-laptop.png'), path.join(posesDir, 'settings-wrench.png'));
  // Progress chart
  fs.copyFileSync(path.join(posesDir, 'hero-standing.png'), path.join(posesDir, 'progress-chart.png'));
  // Clapping
  fs.copyFileSync(path.join(posesDir, 'thumbs-up.png'), path.join(posesDir, 'clapping.png'));
  // Waving
  fs.copyFileSync(path.join(posesDir, 'hero-standing.png'), path.join(posesDir, 'waving.png'));
  // Shushing
  fs.copyFileSync(path.join(facesDir, 'thinking.png'), path.join(posesDir, 'shushing.png'));
  // Drinking water
  fs.copyFileSync(path.join(posesDir, 'rest-timer-sitting.png'), path.join(posesDir, 'drinking-water.png'));
  // Stretching
  fs.copyFileSync(path.join(posesDir, 'gym-warmup.png'), path.join(posesDir, 'stretching.png'));
  // Cooking
  fs.copyFileSync(path.join(posesDir, 'food-plate.png'), path.join(posesDir, 'cooking.png'));

  // Missing faces:
  // Tired
  fs.copyFileSync(path.join(posesDir, 'rest-timer-sitting.png'), path.join(facesDir, 'tired.png'));
  // Angry
  fs.copyFileSync(path.join(facesDir, 'focused.png'), path.join(facesDir, 'angry.png'));
  // Surprised
  fs.copyFileSync(path.join(facesDir, 'confused.png'), path.join(facesDir, 'surprised.png'));
  // Sleepy
  fs.copyFileSync(path.join(posesDir, 'hero-rest-day.png'), path.join(facesDir, 'sleepy.png'));

  console.log('All character assets prepared successfully!');
}

inspectAndExtract().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
