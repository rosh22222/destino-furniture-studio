const fs = require('fs');

try {
  let data = fs.readFileSync('lib/data.ts', 'utf8');

  const productsRegex = /export const products: Product\[\] = \[([\s\S]*?)\];\s*export const clients/g;
  let productsMatch = productsRegex.exec(data);

  if (!productsMatch) {
    console.log("Could not find products array");
    process.exit(1);
  }

  let productsStr = productsMatch[1];
  const blocks = productsStr.split(/(\n  \},?)/); // splits into blocks and delimiters

  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    if (!block.includes('slug:')) continue;
    
    // Extract info
    const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
    const typeMatch = block.match(/furnitureType:\s*["']([^"']+)["']/);
    const catMatch = block.match(/categorySlug:\s*["']([^"']+)["']/);
    
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const fType = typeMatch ? typeMatch[1] : '';
    const cSlug = catMatch ? catMatch[1] : '';
    
    // Skip the manually written custom ranges that shouldn't be altered
    if (name.includes('Range') || (name.includes('Furniture') && !name.includes('Office Chair')) || name.includes('Turnkey') || name.includes('Cabinetry') || name.includes('Seating')) {
      if (!name.includes('Chair 1') && !name.includes('Chair 2') && !name.includes('Chair 3')) {
        continue;
      }
    }
    
    // Generate description based on type or category
    let shortDesc, fullDesc, feats;
    
    if (name.includes('Chair')) {
      if (cSlug === 'ergonomic-chairs') {
        shortDesc = 'Advanced ergonomic chair with lumbar support.';
        fullDesc = `The ${name} is engineered for all-day comfort. Featuring adjustable lumbar support, breathable mesh, and customizable armrests, it ensures optimal posture during long work hours.`;
        feats = "['Adjustable lumbar support', 'Breathable mesh back', 'Customizable armrests']";
      } else if (cSlug === 'cafeteria-chairs') {
        shortDesc = 'Stylish and easy-to-clean cafeteria chair.';
        fullDesc = `Enhance your dining or break area with the ${name}. Designed for high-traffic environments, it offers durability, comfort, and a sleek aesthetic that complements any modern cafeteria.`;
        feats = "['Easy to clean surface', 'Durable frame', 'Stackable design']";
      } else if (cSlug === 'banquet-chairs') {
        shortDesc = 'Elegant banquet chair for events and conferences.';
        fullDesc = `The ${name} provides premium seating for any event. Its plush cushioning and sturdy frame make it ideal for banquets, conferences, and formal gatherings where comfort meets elegance.`;
        feats = "['Premium cushioning', 'Sturdy metal frame', 'Elegant fabric upholstery']";
      } else if (cSlug === 'metal-series') {
        shortDesc = 'Industrial metal series seating.';
        fullDesc = `Part of our metal series, the ${name} combines industrial aesthetics with rugged durability. Perfect for modern offices looking for a bold, minimalist seating solution.`;
        feats = "['Rugged metal build', 'Industrial design', 'Long-lasting durability']";
      } else if (cSlug === 'workstation-tables-and-chairs') {
        shortDesc = 'Compact workstation task chair.';
        fullDesc = `The ${name} is tailored for workstation setups. It offers flexible movement, compact footprint, and essential ergonomic features to keep you productive and comfortable.`;
        feats = "['Compact footprint', 'Swivel and tilt mechanism', 'Breathable fabric']";
      } else {
        shortDesc = 'Versatile office seating solution.';
        fullDesc = `The ${name} is a versatile seating solution designed for various office environments. It delivers a perfect balance of comfort, durability, and contemporary style.`;
        feats = "['Ergonomic design', 'Durable materials', 'Modern aesthetic']";
      }
    } else if (name.includes('Table')) {
      if (cSlug === 'cafeteria-tables') {
        shortDesc = 'Durable cafeteria dining table.';
        fullDesc = `The ${name} is a robust dining table crafted for cafeterias and break rooms. Its scratch-resistant surface and sturdy legs ensure it can withstand daily heavy use.`;
        feats = "['Scratch-resistant top', 'Sturdy legs', 'Easy maintenance']";
      } else if (cSlug === 'workstation-tables-and-chairs') {
        shortDesc = 'Collaborative workstation table.';
        fullDesc = `Designed for teamwork, the ${name} offers a spacious and organized work area. It includes integrated cable management and partition options for a focused yet collaborative environment.`;
        feats = "['Integrated cable management', 'Spacious work area', 'Modular design']";
      } else {
        shortDesc = 'Premium executive office table.';
        fullDesc = `Elevate your workspace with the ${name}. Featuring a sleek finish and ample surface area, it is the perfect centerpiece for any executive cabin or modern home office.`;
        feats = "['Sleek finish', 'Ample surface area', 'Premium materials']";
      }
    } else if (name.includes('Storage Unit')) {
      shortDesc = 'Secure and spacious storage unit.';
      fullDesc = `Keep your workspace organized with the ${name}. It offers versatile storage options, durable shelves, and a secure locking mechanism to protect your important documents and items.`;
      feats = "['Secure locking mechanism', 'Adjustable shelving', 'Robust build']";
    } else if (name.includes('Swing')) {
      shortDesc = 'Comfortable and relaxing indoor swing.';
      fullDesc = `Add a touch of relaxation to your lounge or balcony with the ${name}. Crafted for comfort and durability, it features premium cushioning and a sturdy suspension system.`;
      feats = "['Premium cushioning', 'Sturdy suspension', 'Relaxing design']";
    } else if (name.includes('Recliner')) {
      shortDesc = 'Luxurious reclining lounge chair.';
      fullDesc = `Experience ultimate relaxation with the ${name}. Featuring plush upholstery, multiple reclining angles, and a supportive footrest, it is the perfect addition to any lounge or executive space.`;
      feats = "['Plush upholstery', 'Multiple reclining angles', 'Supportive footrest']";
    } else if (name.includes('Sofa')) {
      shortDesc = 'Modern and plush multi-seater sofa.';
      fullDesc = `The ${name} offers premium comfort for visitors and executives alike. Its modern design, deep cushioning, and durable fabric make it an inviting centerpiece for reception and lounge areas.`;
      feats = "['Deep cushioning', 'Durable fabric', 'Modern design']";
    } else if (name.includes('Workstation')) {
      shortDesc = 'Modular multi-person workstation.';
      fullDesc = `Optimize your office layout with the ${name}. This modular system supports multiple users with dedicated cable routing, privacy panels, and a sleek, professional finish.`;
      feats = "['Modular multi-person setup', 'Privacy panels', 'Dedicated cable routing']";
    } else {
      continue;
    }

    // Use a hash to add slight variation based on the name length or char codes
    const variation = (name.charCodeAt(name.length-1) % 3);
    if (variation === 1) {
      shortDesc = shortDesc.replace('.', ' for modern spaces.');
    } else if (variation === 2) {
      shortDesc = shortDesc.replace('.', ' with premium finish.');
    }

    // Replace shortDescription
    block = block.replace(/shortDescription:\s*(["']).*?\1/, `shortDescription: "${shortDesc}"`);
    
    // Replace fullDescription
    block = block.replace(/fullDescription:\s*(["']).*?\1/, `fullDescription: "${fullDesc}"`);
    
    // Replace features
    block = block.replace(/features:\s*\[([\s\S]*?)\]/, `features: ${feats}`);
    
    // Replace seoTitle
    block = block.replace(/seoTitle:\s*(["']).*?\1/, `seoTitle: "${name} | Destino Furniture Studio"`);
    
    // Replace seoDescription
    block = block.replace(/seoDescription:\s*(["']).*?\1/, `seoDescription: "Explore the ${name}, offering ${shortDesc.toLowerCase()}"`);

    blocks[i] = block;
  }

  // Re-assemble data
  const newProductsStr = blocks.join('');
  data = data.replace(productsStr, newProductsStr);

  fs.writeFileSync('lib/data.ts', data);
  console.log("Successfully updated descriptions.");
} catch (error) {
  console.error("Error:", error);
}
