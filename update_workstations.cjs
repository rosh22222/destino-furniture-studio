const fs = require('fs');
const path = require('path');

const file = 'lib/data.ts';
let content = fs.readFileSync(file, 'utf8');

const slug = 'workstation-table-system';

// Remove the workstation-table-system product
const objPattern = new RegExp(`\\s*\\{\\s*slug:\\s*"${slug}"[\\s\\S]*?updatedAt:\\s*"\\d{4}-\\d{2}-\\d{2}",\\s*\\},?`, 'g');
content = content.replace(objPattern, '');

// Remove references
content = content.split(`"${slug}", `).join('');
content = content.split(`, "${slug}"`).join('');
content = content.split(`"${slug}"`).join('');

// Delete old directory
const dirPath = path.join(__dirname, 'public', 'images', 'products', slug);
if (fs.existsSync(dirPath)) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  console.log(`Deleted directory ${dirPath}`);
}

// Generate new workstations
const newWorkstations = [];
for (let i = 1; i <= 6; i++) {
  newWorkstations.push(`  {
    slug: "workstation-${i}",
    name: "Workstation ${i}",
    categorySlug: "workstation-tables-and-chairs",
    furnitureType: "Workstations",
    image: "/images/products/workstation/work${i}.png",
    gallery: ["/images/products/workstation/work${i}.png"],
    shortDescription: "Modern and efficient workstation.",
    fullDescription: "A modern workstation designed to maximize productivity and space efficiency in your office.",
    features: ["Space-saving design", "Cable management", "Sturdy build"],
    relatedSlugs: [],
    displayOrder: ${200 + i},
    status: "published",
    seoTitle: "Workstation ${i} | Destino Furniture Studio",
    seoDescription: "Explore our modern workstations for your office.",
    updatedAt: "2026-09-01",
  }`);
}

const insertionPoint = '];\n\nexport const clients: Client[] = [';
const itemsString = newWorkstations.join(',\n') + '\n';

if (content.includes(insertionPoint)) {
  content = content.replace(insertionPoint, itemsString + insertionPoint);
  console.log('Successfully added 6 workstations.');
} else {
  console.log('Could not find insertion point.');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Workstation update completed.');
