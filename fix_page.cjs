const fs = require('fs');
let text = fs.readFileSync('app/page.tsx', 'utf8');

// fix cafeteria-chairs link
text = text.replace(
  'href: "/products/cafeteria-furniture",\n    image: "/images/categories/cafeteria-chair.png"',
  'href: "/products/cafeteria-chairs",\n    image: "/images/categories/cafeteria-chair.png"'
);

// fix top padding between hero and image
text = text.replace(
  'className="bg-[#FBF8F3] px-4 py-8 sm:px-6 md:py-10 lg:px-8"',
  'className="bg-[#FBF8F3] px-4 pb-8 sm:px-6 md:pb-10 lg:px-8 pt-0"'
);

fs.writeFileSync('app/page.tsx', text);
