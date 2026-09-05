const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public', 'images');
const dataTsPath = path.join(__dirname, 'lib', 'data.ts');

let dataTs = fs.readFileSync(dataTsPath, 'utf8');

// 1. Fix product covers
const productsDir = path.join(publicDir, 'products');
const productFolders = fs.readdirSync(productsDir);

for (const folder of productFolders) {
  const folderPath = path.join(productsDir, folder);
  if (!fs.statSync(folderPath).isDirectory()) continue;
  
  const files = fs.readdirSync(folderPath);
  let newCover = null;
  for (const f of files) {
    if (f !== 'cover.jpeg' && f !== 'cover.png' && !f.startsWith('gallery-') && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))) {
      if (f.startsWith('ChatGPT Image') || f.match(/^[a-f0-9\-]{36}\./)) {
        newCover = f;
        break;
      }
    }
  }
  
  if (newCover) {
    console.log(`Fixing cover for ${folder} -> ${newCover}`);
    const oldJpeg = path.join(folderPath, 'cover.jpeg');
    const oldPng = path.join(folderPath, 'cover.png');
    if (fs.existsSync(oldJpeg)) {
      fs.unlinkSync(oldJpeg);
    }
    if (fs.existsSync(oldPng)) {
        fs.unlinkSync(oldPng);
    }
    const newCoverExt = path.extname(newCover);
    const newCoverName = `cover${newCoverExt}`;
    fs.renameSync(path.join(folderPath, newCover), path.join(folderPath, newCoverName));
    
    // update data.ts
    const oldPathStrJpeg = `products/${folder}/cover.jpeg`;
    const newPathStr = `products/${folder}/cover${newCoverExt}`;
    dataTs = dataTs.replaceAll(oldPathStrJpeg, newPathStr);
  }
}

fs.writeFileSync(dataTsPath, dataTs);
console.log('Done fixing product covers.');
