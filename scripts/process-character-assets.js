const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Fares\\.gemini\\antigravity-ide\\brain\\c1383f2c-5ae8-4971-a7e5-7852296611bd';
const publicDir = 'C:\\Users\\Fares\\Desktop\\Gym\\public\\character';

// Helper: Remove dark background outside sticker border via flood fill
async function makeTransparent(inputPath, outputPath, cropBox = null) {
  let pipeline = sharp(inputPath);
  if (cropBox) {
    pipeline = pipeline.extract(cropBox);
  }

  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const visited = new Uint8Array(w * h);
  const queue = [];

  function isBackground(idx) {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    // Background is dark (r,g,b < 65) OR near outer edge light border (within 6px of outer edge)
    return (r < 65 && g < 65 && b < 65);
  }

  // Seed boundary
  for (let x = 0; x < w; x++) {
    if (isBackground(x)) { queue.push(x); visited[x] = 1; }
    const bIdx = (h - 1) * w + x;
    if (isBackground(bIdx)) { queue.push(bIdx); visited[bIdx] = 1; }
  }
  for (let y = 0; y < h; y++) {
    const lIdx = y * w;
    if (isBackground(lIdx) && !visited[lIdx]) { queue.push(lIdx); visited[lIdx] = 1; }
    const rIdx = y * w + (w - 1);
    if (isBackground(rIdx) && !visited[rIdx]) { queue.push(rIdx); visited[rIdx] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    // Set alpha to 0
    data[curr * 4 + 3] = 0;

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < w - 1 ? curr + 1 : -1,
      cy > 0 ? curr - w : -1,
      cy < h - 1 ? curr + w : -1
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        visited[n] = 1;
        if (isBackground(n)) {
          queue.push(n);
        }
      }
    }
  }

  // Remove any tiny border artifacts along the very edge
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < 4; y++) data[(y * w + x) * 4 + 3] = 0;
    for (let y = h - 4; y < h; y++) data[(y * w + x) * 4 + 3] = 0;
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < 4; x++) data[(y * w + x) * 4 + 3] = 0;
    for (let x = w - 4; x < w; x++) data[(y * w + x) * 4 + 3] = 0;
  }

  // Trim transparent edges & write PNG
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`✓ Processed: ${path.basename(outputPath)}`);
}

async function run() {
  fs.mkdirSync(path.join(publicDir, 'poses'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'faces'), { recursive: true });

  const tasks = [
    // Poses
    {
      src: path.join(brainDir, 'mini_fares_hero_standing_1789653984776.jpg'),
      dest: path.join(publicDir, 'poses', 'hero-standing.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_hero_bench_1789654090575.jpg'),
      dest: path.join(publicDir, 'poses', 'hero-bench.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_gym_dumbbell_1789654188920.jpg'),
      dest: path.join(publicDir, 'poses', 'gym-dumbbell.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_rest_timer_1789654317038.jpg'),
      dest: path.join(publicDir, 'poses', 'rest-timer-sitting.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_fist_pump_1789654405510.jpg'),
      dest: path.join(publicDir, 'poses', 'fist-pump.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_waving_1789654561215.jpg'),
      dest: path.join(publicDir, 'poses', 'waving.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_thumbs_up_1789654678464.jpg'),
      dest: path.join(publicDir, 'poses', 'thumbs-up.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_shushing_1789654776726.jpg'),
      dest: path.join(publicDir, 'poses', 'shushing.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_trophy_1789654856573.jpg'),
      dest: path.join(publicDir, 'poses', 'trophy.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_food_plate_1789654937320.jpg'),
      dest: path.join(publicDir, 'poses', 'food-plate.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_study_laptop_1789655153707.jpg'),
      dest: path.join(publicDir, 'poses', 'study-laptop.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_settings_wrench_1789655257367.jpg'),
      dest: path.join(publicDir, 'poses', 'settings-wrench.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_avatar_1789653260778.jpg'),
      dest: path.join(publicDir, 'avatar.png')
    },
    {
      src: path.join(brainDir, 'mini_fares_avatar_1789653260778.jpg'),
      dest: path.join(publicDir, 'poses', 'avatar-circle.png')
    },

    // Faces extracted cleanly from the dedicated high-res illustrations
    {
      src: path.join(brainDir, 'mini_fares_avatar_1789653260778.jpg'),
      dest: path.join(publicDir, 'faces', 'normal.png'),
      crop: { left: 350, top: 80, width: 320, height: 320 }
    },
    {
      src: path.join(brainDir, 'mini_fares_avatar_1789653260778.jpg'),
      dest: path.join(publicDir, 'faces', 'happy.png'),
      crop: { left: 350, top: 80, width: 320, height: 320 }
    },
    {
      src: path.join(brainDir, 'mini_fares_fist_pump_1789654405510.jpg'),
      dest: path.join(publicDir, 'faces', 'laughing.png'),
      crop: { left: 340, top: 220, width: 380, height: 380 }
    },
    {
      src: path.join(brainDir, 'mini_fares_gym_dumbbell_1789654188920.jpg'),
      dest: path.join(publicDir, 'faces', 'focused.png'),
      crop: { left: 370, top: 100, width: 260, height: 290 }
    },
    {
      src: path.join(brainDir, 'mini_fares_gym_dumbbell_1789654188920.jpg'),
      dest: path.join(publicDir, 'faces', 'angry.png'),
      crop: { left: 370, top: 100, width: 260, height: 290 }
    },
    {
      src: path.join(brainDir, 'mini_fares_rest_timer_1789654317038.jpg'),
      dest: path.join(publicDir, 'faces', 'tired.png'),
      crop: { left: 300, top: 110, width: 340, height: 320 }
    },
    {
      src: path.join(brainDir, 'mini_fares_study_laptop_1789655153707.jpg'),
      dest: path.join(publicDir, 'faces', 'thinking.png'),
      crop: { left: 380, top: 100, width: 280, height: 290 }
    },
  ];

  for (const t of tasks) {
    try {
      await makeTransparent(t.src, t.dest, t.crop);
    } catch (err) {
      console.error(`Error processing ${t.dest}:`, err.message);
    }
  }

  console.log('All character assets successfully processed!');
}

run();
