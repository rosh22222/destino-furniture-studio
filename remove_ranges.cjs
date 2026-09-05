const fs = require('fs');
const path = require('path');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

const slugsToRemove = ['ergonomic-task-chair-range', 'executive-office-chair-range'];

for (const slug of slugsToRemove) {
  // Remove the product object
  const objPattern = new RegExp(`\\s*\\{\\s*slug:\\s*"${slug}"[\\s\\S]*?updatedAt:\\s*"\\d{4}-\\d{2}-\\d{2}",\\s*\\},?`, 'g');
  content = content.replace(objPattern, '');

  // Remove the string from relatedSlugs array
  const str1 = `"${slug}", `;
  const str2 = `, "${slug}"`;
  const str3 = `"${slug}"`;
  
  content = content.split(str1).join('');
  content = content.split(str2).join('');
  content = content.split(str3).join('');
  
  // Also delete directory
  const dirPath = path.join(__dirname, 'public', 'images', 'products', slug);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`Deleted directory ${dirPath}`);
  }
}

fs.writeFileSync(file, content, 'utf8');
console.log('Removed ranges from data.ts and deleted folders');
