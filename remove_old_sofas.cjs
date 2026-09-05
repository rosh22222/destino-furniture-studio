const fs = require('fs');
const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

const slugsToRemove = ['contemporary-lounge-sofa', 'classic-leather-sofa', 'minimalist-modern-sofa', 'plush-sectional-sofa'];

slugsToRemove.forEach(slug => {
  const pattern = new RegExp(`\\s*\\{\\s*slug: "${slug}",[\\s\\S]*?updatedAt: "2026-08-30",\\s*\\},`, 'g');
  content = content.replace(pattern, '');
});

fs.writeFileSync(file, content, 'utf8');
console.log('Removed old sofas');
