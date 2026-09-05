const fs = require('fs');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

// The easiest way to replace chairs is to just use a regular expression 
// that removes all chairs we generated before.
// Or we can parse the AST, but regex is faster for this specific format.

// Let's just remove all products that are named "Office Chair X" 
const chairPattern = /\s*\{\s*slug: "office-chair-\d+",[\s\S]*?updatedAt: "2026-08-30",\s*\},/g;
content = content.replace(chairPattern, '');

// Also remove any remaining chairs just in case (e.g. from 1-34)
const chairPatternNew = /\s*\{\s*slug: "office-chair-\d+",[\s\S]*?updatedAt: "2026-08-31",\s*\},/g;
content = content.replace(chairPatternNew, '');

// Create 34 new chairs
const newChairs = [];
for (let i = 1; i <= 34; i++) {
  newChairs.push(`  {
    slug: "office-chair-${i}",
    name: "Office Chair ${i}",
    categorySlug: "office-chairs",
    furnitureType: "Chairs",
    image: "/images/products/chairs/chair${i}.png",
    gallery: ["/images/products/chairs/chair${i}.png"],
    shortDescription: "Premium ergonomic office chair.",
    fullDescription: "A premium office chair designed for ultimate comfort and productivity in modern workspaces.",
    features: ["Adjustable height", "Ergonomic support", "Durable build"],
    relatedSlugs: ["ergonomic-task-chair-range"],
    displayOrder: ${20 + i},
    status: "published",
    seoTitle: "Office Chair ${i} | Destino Furniture Studio",
    seoDescription: "Explore our premium ergonomic office chair.",
    updatedAt: "2026-08-31",
  }`);
}

const insertionPoint = '];\n\nexport const clients: Client[] = [';
const chairsString = newChairs.join(',\n') + '\n';

if (content.includes(insertionPoint)) {
  content = content.replace(insertionPoint, chairsString + insertionPoint);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully added 34 chairs.');
} else {
  console.log('Could not find insertion point.');
}
