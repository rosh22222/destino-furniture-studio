const fs = require('fs');
const data = fs.readFileSync('lib/data.ts', 'utf8');
const productsMatch = data.match(/export const products: Product\[\] = \[([\s\S]*?)\];\s*export const clients/);
if (productsMatch) {
  const productsStr = productsMatch[1];
  const objs = productsStr.split('  },').map(s => s.trim()).filter(s => s.length > 0);
  const names = objs.map(o => {
    const match = o.match(/name: ["'](.*?)["']/);
    return match ? match[1] : '';
  }).filter(Boolean);
  console.log(names.join(', '));
}
