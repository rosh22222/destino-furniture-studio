const fs = require('fs');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

const newStorageItems = [];
for (let i = 1; i <= 9; i++) {
  newStorageItems.push(`  {
    slug: "storage-${i}",
    name: "Premium Storage Unit ${i}",
    categorySlug: "office-furniture", 
    furnitureType: "Storage",
    image: "/images/products/storage/storage${i}.png",
    gallery: ["/images/products/storage/storage${i}.png"],
    shortDescription: "Modern and secure office storage solution.",
    fullDescription: "A modern storage unit designed to keep your office space organized, secure, and stylish.",
    features: ["Secure locking mechanism", "Spacious shelving", "Durable construction"],
    relatedSlugs: ["office-desk-and-table-range"],
    displayOrder: ${100 + i},
    status: "published",
    seoTitle: "Premium Storage Unit ${i} | Destino Furniture Studio",
    seoDescription: "Explore our premium storage solutions.",
    updatedAt: "2026-08-31",
  }`);
}

const itemsString = newStorageItems.join(',\n') + '\n';

// Find the last product closing brace before the end of the products array
const targetStr = '  }\n];\n\nexport const clients: Client[] = [';
const replacementStr = '  },\n' + itemsString + '];\n\nexport const clients: Client[] = [';

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully added 9 storage products.');
} else {
  console.log('Could not find insertion point. Trying regex fallback...');
  // Fallback regex
  const regex = /  }\r?\n\];\r?\n\r?\nexport const clients/;
  if (regex.test(content)) {
    content = content.replace(regex, '  },\n' + itemsString + '];\n\nexport const clients');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully added 9 storage products via regex fallback.');
  } else {
    console.error('Failed to append items.');
  }
}
