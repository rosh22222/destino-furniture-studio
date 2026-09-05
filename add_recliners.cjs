const fs = require('fs');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

const newRecliners = [];
for (let i = 1; i <= 7; i++) {
  newRecliners.push(`  {
    slug: "recliner-${i}",
    name: "Premium Recliner ${i}",
    categorySlug: "domestic-furniture", 
    furnitureType: "Recliners",
    image: "/images/products/recliner/recliner${i}.png",
    gallery: ["/images/products/recliner/recliner${i}.png"],
    shortDescription: "Luxurious and comfortable recliner.",
    fullDescription: "A premium recliner designed for maximum comfort, perfect for lounging and relaxation.",
    features: ["Premium upholstery", "Adjustable recline", "Exceptional comfort"],
    relatedSlugs: [],
    displayOrder: ${150 + i},
    status: "published",
    seoTitle: "Premium Recliner ${i} | Destino Furniture Studio",
    seoDescription: "Explore our premium recliners.",
    updatedAt: "2026-08-31",
  }`);
}

const itemsString = newRecliners.join(',\n') + '\n';

// Find the last product closing brace before the end of the products array
const targetStr = '  }\n];\n\nexport const clients: Client[] = [';
const replacementStr = '  },\n' + itemsString + '];\n\nexport const clients: Client[] = [';

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully added 7 recliners.');
} else {
  console.log('Could not find insertion point.');
  const regex = /  }\r?\n\];\r?\n\r?\nexport const clients/;
  if (regex.test(content)) {
    content = content.replace(regex, '  },\n' + itemsString + '];\n\nexport const clients');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Successfully added 7 recliners via regex fallback.');
  } else {
    console.error('Failed to append items.');
  }
}
