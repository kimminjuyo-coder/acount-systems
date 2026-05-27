import fs from 'fs';
import path from 'path';

const srcDir = '/Users/kimmanju/.gemini/antigravity/brain/f3e17e51-de89-4f1f-8fa1-54468e0ba450';
const destDir = './src/assets';

const filesToCopy = [
  { src: 'media__1779841556114.png', dest: 'guide_pm.png' },
  { src: 'media__1779841467744.png', dest: 'guide_worker.png' },
  { src: 'media__1779780865245.png', dest: 'guide_admin.png' }
];

filesToCopy.forEach(file => {
  const srcPath = path.join(srcDir, file.src);
  const destPath = path.join(destDir, file.dest);
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file.src} to ${destPath}`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  } catch (err) {
    console.error(`Error copying ${file.src}:`, err.message);
  }
});
