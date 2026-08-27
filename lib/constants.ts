export const siteConfig = {
  name: "Destino Furniture Studio",
  legalName: "Destino Furniture Studio, A Unit of Manidivya Enterprises",
  parentCompany: "Manidivya Enterprises",
  contactPerson: "Manikanta Pradeep M",
  phoneDisplay: "+91 9948191991",
  phoneHref: "+919948191991",
  whatsappDisplay: "+91 9959401058",
  whatsappHref: "919959401058",
  email: "sales@destinofurniture.com",
  website: "www.destinofurniture.com",
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.destinofurniture.com",
  cities: ["Visakhapatnam", "Kakinada", "Bengaluru"],
  brandLine: "Chairs with Futuristic Options",
  defaultOgImage: "/legacy/image%20(1)-w08GJtF5.jpeg",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "Clients", href: "/clients" },
  { label: "Contact", href: "/contact" },
];

export const confirmationItems = [
  "Transparent high-resolution Destino logo",
  "Street addresses for Visakhapatnam, Kakinada and Bengaluru",
  "Business hours for each location",
  "Verified Google Maps direction links for each branch",
  "Official social-media and Google Business Profile URLs",
  "SKU-level product names, dimensions, materials, finishes and brochures",
  "Any awards, ratings, establishment year, prices or warranty claims",
];
