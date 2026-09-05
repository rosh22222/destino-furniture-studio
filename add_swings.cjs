const fs = require('fs');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

const newSwings = [];
for (let i = 1; i <= 7; i++) {
  newSwings.push(`  {
    slug: "swing-${i}",
    name: "Premium Swing ${i}",
    categorySlug: "domestic-furniture", 
    furnitureType: "Swings",
    image: "/images/products/swings/swing${i}.png",
    gallery: ["/images/products/swings/swing${i}.png"],
    shortDescription: "Elegant and relaxing swing.",
    fullDescription: "A beautifully crafted swing designed for relaxation and elegance in your indoor or outdoor spaces.",
    features: ["Durable construction", "Comfortable seating", "Elegant design"],
    relatedSlugs: [],
    displayOrder: ${160 + i},
    status: "published",
    seoTitle: "Premium Swing ${i} | Destino Furniture Studio",
    seoDescription: "Explore our elegant and relaxing swings.",
    updatedAt: "2026-08-31",
  }`);
}

const itemsString = newSwings.join(',\n') + '\n';

// Find the last product closing brace before the end of the products array
const targetStr = '  }\n];\n\nexport const clients: Client[] = [';
const replacementStr = '  },\n' + itemsString + '];\n\nexport const clients: Client[] = [';

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully added 7 swings.');
} else {
  console.log('Could not find insertion point.');
  const regex = /  }\r?\n\];\r?\n\r?\nexport const clients/;
  if (regex.test(content)) {
    content = content.replace(regex, '  },\n' + itemsString + '];\n\nexport const clients');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully added 7 swings via regex fallback.');
  } else {
    console.error('Failed to append items.');
  }
}
