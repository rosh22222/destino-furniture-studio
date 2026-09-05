const fs = require('fs');
let data = fs.readFileSync('lib/data.ts', 'utf8');

// 1. Add missing categories
const newCategories = `
  {
    slug: 'storage-units',
    name: 'Storage Units',
    summary: 'Storage units and cabinets.',
    description: 'Various storage solutions for office and commercial use.',
    image: '/images/categories/storage-units.jpg',
    displayOrder: 12,
    keywords: ['storage', 'cabinets'],
  },
  {
    slug: 'metal-series',
    name: 'Metal Series',
    summary: 'Metal series furniture.',
    description: 'Durable metal furniture for various applications.',
    image: '/images/categories/metal-series.png',
    displayOrder: 13,
    keywords: ['metal', 'furniture'],
  },
  {
    slug: 'banquet-chairs',
    name: 'Banquet Chairs',
    summary: 'Banquet chairs and seating.',
    description: 'Comfortable and stackable banquet chairs for events.',
    image: '/images/categories/banquet-chairs.jpg',
    displayOrder: 14,
    keywords: ['banquet', 'chairs', 'events'],
  },
  {
    slug: 'cafeteria-tables',
    name: 'Cafeteria Tables',
    summary: 'Tables for cafeteria.',
    description: 'Durable tables for cafeteria and dining areas.',
    image: '/images/categories/cafeteria-tables.jpg',
    displayOrder: 15,
    keywords: ['cafeteria', 'tables'],
  }
`;

if (!data.includes('slug: "storage-units"')) {
  data = data.replace('];\n\nexport const brands', ',' + newCategories + '];\n\nexport const brands');
}

// 2. Change categorySlugs of some chairs
for (let i = 1; i <= 10; i++) {
  data = data.replace(
    new RegExp(`slug: "office-chair-${i}",[\\s\\S]*?categorySlug: "office-chairs"`),
    match => match.replace('"office-chairs"', '"ergonomic-chairs"')
  );
}
for (let i = 21; i <= 25; i++) {
  data = data.replace(
    new RegExp(`slug: "office-chair-${i}",[\\s\\S]*?categorySlug: "office-chairs"`),
    match => match.replace('"office-chairs"', '"workstation-tables-and-chairs"')
  );
}
for (let i = 26; i <= 28; i++) {
  data = data.replace(
    new RegExp(`slug: "office-chair-${i}",[\\s\\S]*?categorySlug: "office-chairs"`),
    match => match.replace('"office-chairs"', '"banquet-chairs"')
  );
}
for (let i = 29; i <= 34; i++) {
  data = data.replace(
    new RegExp(`slug: "office-chair-${i}",[\\s\\S]*?categorySlug: "office-chairs"`),
    match => match.replace('"office-chairs"', '"metal-series"')
  );
}

// 3. Change categorySlugs of some tables
for (let i = 4; i <= 6; i++) {
  data = data.replace(
    new RegExp(`slug: "table-${i}",[\\s\\S]*?categorySlug: "office-tables"`),
    match => match.replace('"office-tables"', '"workstation-tables-and-chairs"')
  );
}
for (let i = 7; i <= 9; i++) {
  data = data.replace(
    new RegExp(`slug: "table-${i}",[\\s\\S]*?categorySlug: "office-tables"`),
    match => match.replace('"office-tables"', '"cafeteria-tables"')
  );
}

// 4. Add a couple of products for storage-units
const storageProducts = `
  {
    slug: 'storage-unit-1',
    name: 'Storage Unit 1',
    categorySlug: 'storage-units',
    furnitureType: 'Storage',
    image: '/images/products/storage/storage1.png',
    gallery: ['/images/products/storage/storage1.png'],
    shortDescription: 'Premium storage unit.',
    fullDescription: 'A premium storage unit designed for ultimate organization.',
    features: ['Adjustable shelves', 'Durable build'],
    relatedSlugs: [],
    displayOrder: 200,
    status: 'published',
    seoTitle: 'Storage Unit 1 | Destino Furniture Studio',
    seoDescription: 'Explore our premium storage unit.',
    updatedAt: '2026-08-31',
  },
  {
    slug: 'storage-unit-2',
    name: 'Storage Unit 2',
    categorySlug: 'storage-units',
    furnitureType: 'Storage',
    image: '/images/products/storage/storage2.png',
    gallery: ['/images/products/storage/storage2.png'],
    shortDescription: 'Premium storage unit.',
    fullDescription: 'A premium storage unit designed for ultimate organization.',
    features: ['Adjustable shelves', 'Durable build'],
    relatedSlugs: [],
    displayOrder: 201,
    status: 'published',
    seoTitle: 'Storage Unit 2 | Destino Furniture Studio',
    seoDescription: 'Explore our premium storage unit.',
    updatedAt: '2026-08-31',
  }
`;

if (!data.includes("slug: 'storage-unit-1'")) {
  data = data.replace('];\n\nexport const clients', ',' + storageProducts + '];\n\nexport const clients');
}

fs.writeFileSync('lib/data.ts', data);
console.log('Fixed lib/data.ts');
