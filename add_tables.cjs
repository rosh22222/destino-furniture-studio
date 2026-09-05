const fs = require('fs');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

// Remove existing tables
const tablePattern = /\s*\{\s*slug: "table-\d+",[\s\S]*?updatedAt: "2026-08-\d+",\s*\},/g;
content = content.replace(tablePattern, '');

const newTables = [];
for (let i = 1; i <= 9; i++) {
  newTables.push(`  {
    slug: "table-${i}",
    name: "Premium Table ${i}",
    categorySlug: "office-tables", 
    furnitureType: "Tables",
    image: "/images/products/tables/table${i}.png",
    gallery: ["/images/products/tables/table${i}.png"],
    shortDescription: "Sleek and modern office table.",
    fullDescription: "A beautifully crafted premium table designed for modern office environments and workspaces.",
    features: ["Sturdy construction", "Spacious surface", "Elegant design"],
    relatedSlugs: ["office-desk-and-table-range"],
    displayOrder: ${170 + i},
    status: "published",
    seoTitle: "Premium Table ${i} | Destino Furniture Studio",
    seoDescription: "Explore our sleek and modern premium tables.",
    updatedAt: "2026-08-31",
  }`);
}

const itemsString = newTables.join(',\n') + '\n';

// Find the last product closing brace before the end of the products array
const targetStr = '  }\n];\n\nexport const clients: Client[] = [';
const replacementStr = '  },\n' + itemsString + '];\n\nexport const clients: Client[] = [';

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully added 9 tables.');
} else {
  console.log('Could not find insertion point.');
  const regex = /  }\r?\n\];\r?\n\r?\nexport const clients/;
  if (regex.test(content)) {
    content = content.replace(regex, '  },\n' + itemsString + '];\n\nexport const clients');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully added 9 tables via regex fallback.');
  } else {
    console.error('Failed to append items.');
  }
}
