const calculateValue = (brand, condition, category) => {
  let score = 0;

  // 1. Brand Score
  const premiumBrands = ['gucci', 'prada', 'balenciaga', 'celine', 'dior', 'chanel', 'louis vuitton', 'burberry'];
  const highBrands = ['levi\'s', 'nike', 'adidas', 'reformation', 'zara', 'north face', 'patagonia'];
  
  const b = brand ? brand.toLowerCase().trim() : '';
  
  if (premiumBrands.includes(b)) {
    score += 50;
  } else if (highBrands.includes(b)) {
    score += 25;
  } else if (b) {
    score += 10; // Generic brand
  }

  // 2. Condition Score
  const conditions = {
    'New with tags': 30,
    'Like New': 20,
    'Good': 10,
    'Fair': 5
  };
  score += (conditions[condition] || 0);

  // 3. Category Score
  const categories = {
    'Outerwear': 20,
    'Dresses': 15,
    'Shoes': 15,
    'Accessories': 10,
    'Bottoms': 10,
    'Tops': 5
  };
  score += (categories[category] || 0);

  // 4. Calculate Final Value Tier
  if (score >= 80) return 'Premium';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Medium';
  return 'Low';
};

module.exports = { calculateValue };
