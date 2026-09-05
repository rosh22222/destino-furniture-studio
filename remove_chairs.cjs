const fs = require('fs');
const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

[1, 2, 4, 6].forEach(i => {
  const pattern = new RegExp(`\\s*\\{\\s*slug: "office-chair-${i}",[\\s\\S]*?updatedAt: "2026-08-30",\\s*\\},`, 'g');
  content = content.replace(pattern, '');
});

fs.writeFileSync(file, content, 'utf8');
console.log('Removed specific chairs');
