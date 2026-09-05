const fs = require('fs');
let data = fs.readFileSync('lib/data.ts', 'utf8');

const newCategory = `
  {
    slug: 'cafeteria-chairs',
    name: 'Cafeteria Chairs',
    summary: 'Chairs for cafeteria.',
    description: 'Durable and comfortable chairs for cafeteria and dining areas.',
    image: '/images/categories/cafeteria-chair.png',
    displayOrder: 16,
    keywords: ['cafeteria', 'chairs'],
  }
`;

if (!data.includes("slug: 'cafeteria-chairs'")) {
  data = data.replace('];\n\nexport const brands', ',' + newCategory + '];\n\nexport const brands');
}

for (let i = 18; i <= 20; i++) {
  data = data.replace(
    new RegExp(`slug: "office-chair-${i}",[\\s\\S]*?categorySlug: "office-chairs"`),
    match => match.replace('"office-chairs"', '"cafeteria-chairs"')
  );
}

fs.writeFileSync('lib/data.ts', data);
