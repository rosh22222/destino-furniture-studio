const fs = require('fs');
const path = require('path');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

const chairsToRemove = [1, 2, 3, 4, 5, 6, 8];

chairsToRemove.forEach(i => {
  // Remove from data.ts
  const pattern = new RegExp(`\\s*\\{\\s*slug: "office-chair-${i}",[\\s\\S]*?updatedAt: "2026-08-31",\\s*\\},?`, 'g');
  content = content.replace(pattern, '');
  
  // Delete the image file
  const imagePath = path.join(__dirname, 'public', 'images', 'products', 'chairs', `chair${i}.png`);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log(`Deleted ${imagePath}`);
  } else {
    console.log(`Image not found: ${imagePath}`);
  }
});

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully removed specified chairs from data.ts');
