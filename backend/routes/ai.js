const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// Indian Circular Fashion AI Image Analysis Endpoint
router.post('/analyze', verifyToken, async (req, res) => {
  try {
    const { imageUrl, category } = req.body;

    // Simulate AI processing delay (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1400));

    // Generate simulated dynamic Indian fashion content
    let title = "Handloom Cotton Kurta Set";
    let description = "Authentic Indian artisan craft with breathable hand-spun cotton. Subtle block print motifs, perfect for everyday chic or light festive gatherings.";
    let brand = "FabIndia";
    let suggestedValue = "Tier 2 (Premium Handloom)";
    let fabric = "100% Handloom Khadi Cotton";
    let co2SavedKg = 8.4;
    let waterSavedLiters = 2400;

    const cat = (category || 'general').toLowerCase();

    switch (cat) {
      case 'tops':
      case 'kurta':
        title = "Artisan Block-Print Kurta";
        description = "Hand-blocked Bagru print on organic Chanderi cotton-silk. Elegant neckline with delicate zari detailing.";
        brand = "Anokhi";
        suggestedValue = "Tier 2 (Premium Handloom)";
        fabric = "Chanderi Cotton Silk";
        co2SavedKg = 9.2;
        waterSavedLiters = 2600;
        break;
      case 'bottoms':
      case 'trousers':
        title = "Tailored Linen Cigarette Trousers";
        description = "Lightweight Indian pure flax linen trousers with elasticated back waist for effortless comfort across Indian climates.";
        brand = "Nicobar";
        suggestedValue = "Tier 2 (Premium Handloom)";
        fabric = "100% Pure Indian Linen";
        co2SavedKg = 11.5;
        waterSavedLiters = 3100;
        break;
      case 'dresses':
      case 'saree':
      case 'ethnic':
        title = "Banarasi Katan Silk Saree";
        description = "Timeless heirloom Banarasi silk with intricate floral zari weave. Excellent preserved condition, ready for festive exchanges.";
        brand = "Raw Mango (Pre-loved)";
        suggestedValue = "Tier 1 (Luxury Designer)";
        fabric = "Banarasi Pure Katan Silk";
        co2SavedKg = 18.7;
        waterSavedLiters = 5200;
        break;
      case 'outerwear':
      case 'sherwani':
      case 'jacket':
        title = "Embroidered Nehru/Modi Jacket";
        description = "Structured Tussar silk sleeveless ethnic jacket with horn buttons and fine subtle self-weave embroidery.";
        brand = "Anita Dongre / Jaypore";
        suggestedValue = "Tier 1 (Luxury Designer)";
        fabric = "Tussar Wild Silk";
        co2SavedKg = 14.3;
        waterSavedLiters = 4100;
        break;
      case 'accessories':
      case 'dupatta':
        title = "Hand-Woven Pashmina / Maheshwari Dupatta";
        description = "Delicate zari border dupatta handcrafted by skilled weavers. Elevates simple kurta ensembles instantly.";
        brand = "Good Earth";
        suggestedValue = "Tier 2 (Premium Handloom)";
        fabric = "Maheshwari Silk-Cotton";
        co2SavedKg = 5.1;
        waterSavedLiters = 1400;
        break;
      default:
        title = "Sustainable Indian Handloom Garment";
        description = "Pre-loved artisan piece in exceptional condition. High color fastness and natural fiber weave.";
        brand = "Jaypore";
        suggestedValue = "Tier 2 (Premium Handloom)";
        fabric = "Organic Handloom Cotton";
        co2SavedKg = 7.8;
        waterSavedLiters = 2200;
    }

    res.json({
      success: true,
      data: {
        title,
        description,
        brand,
        suggestedValue,
        fabric,
        co2SavedKg,
        waterSavedLiters,
        tags: [cat, 'handloom', 'make-in-india', 'pre-loved', 'artisan']
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'AI analysis failed' });
  }
});

// AI Indian Fashion Stylist & Outfit Advisor Endpoint
router.post('/stylist', async (req, res) => {
  try {
    const { occasion, vibe, colorPalette } = req.body;

    await new Promise(resolve => setTimeout(resolve, 1100));

    let advice = "";
    let recommendedCategory = "Dresses / Ethnic";
    let stylingTips = [];
    let outfitFormula = "";

    const occ = (occasion || 'casual').toLowerCase();

    if (occ.includes('festive') || occ.includes('wedding')) {
      advice = "For an Indian Festive or Wedding gathering, celebrate rich textile heritage. Pair a handwoven saree or embroidered silk Anarkali with statement antique jadau or oxidized temple silver jewelry.";
      recommendedCategory = "Dresses / Saree";
      outfitFormula = "Banarasi/Chanderi Silk Saree + Antique Temple Jewelry + Hand-Embroidered Juttis";
      stylingTips = [
        "Contrast deep jewel tones (Emerald, Rani Pink, Indigo) with metallic zari weaves.",
        "Drape your dupatta or saree pallu with an open shoulder to showcase artisan borders.",
        "Finish with traditional handcrafted mojadis for comfort during celebrations."
      ];
    } else if (occ.includes('office') || occ.includes('formal')) {
      advice = "Achieve effortless Indian workwear elegance with tailored cotton kurta sets or crisp linen overlays. Breathable fabrics ensure comfort in tropical climates while commanding respect.";
      recommendedCategory = "Tops / Kurta Sets";
      outfitFormula = "Block-Print Cotton Kurta + Cigarette Pants + Minimalist Brass Cuff + Kolhapuris";
      stylingTips = [
        "Choose earthy pigments like Indigo, Indigo Madder, Mustard, or Terracotta.",
        "Opt for structured silhouettes without synthetic lining for all-day ventilation.",
        "Pair with a handcrafted leather laptop satchel."
      ];
    } else if (occ.includes('date') || occ.includes('weekend')) {
      advice = "Blend Indian bohemian charm with modern silhouettes. A light Maheshwari silk dress or fusion drape shirt with high-waisted linen trousers makes a refined statement.";
      recommendedCategory = "Tops / Fusion Wear";
      outfitFormula = "Hand-Block Saree-Drape Shirt + Wide-Leg Trousers + Statement Silver Jhumkas";
      stylingTips = [
        "Mix traditional textiles (Kalamkari, Ikat) with contemporary minimalist cuts.",
        "Layer lightweight scarves or organza shrugs for evening breezes.",
        "Keep makeup dewy with a subtle bindi or warm bronze glow."
      ];
    } else {
      advice = "Sustainable Indian streetwear celebrates artisanal comfort. Mix pre-loved organic cotton tunics or indigo-dyed jackets with relaxed linen bottoms.";
      recommendedCategory = "Bottoms / Fusion";
      outfitFormula = "Bagru Block-Print Relaxed Shirt + Khadi Cotton Joggers + Handcrafted Slip-ons";
      stylingTips = [
        "Embrace natural dye variations—every handloom piece tells a unique story.",
        "Accessorize with an organic jute or canvas tote bag.",
        "Roll up sleeves loosely for an unstudied, creative studio vibe."
      ];
    }

    res.json({
      success: true,
      data: {
        occasion: occasion || "Casual Hangout",
        vibe: vibe || "Minimalist",
        colorPalette: colorPalette || "Earthy Tones",
        advice,
        recommendedCategory,
        outfitFormula,
        stylingTips
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'AI stylist failed to generate recommendations' });
  }
});

// NEW: AI Sustainability & Indian Circular Impact Calculator
router.post('/sustainability-score', async (req, res) => {
  try {
    const { itemsSwapped = 1, fabricType = 'cotton' } = req.body;

    await new Promise(resolve => setTimeout(resolve, 800));

    // Environmental calculation methodology based on Indian textile water footprint & CO2e metrics
    const baseCo2PerItem = 9.4; // kg CO2e saved per average garment
    const baseWaterPerItem = 2700; // liters of water saved per garment
    const landfillDivertedKg = itemsSwapped * 0.45; // average 450g per garment

    const totalCo2Saved = Number((itemsSwapped * baseCo2PerItem).toFixed(1));
    const totalWaterSaved = Math.round(itemsSwapped * baseWaterPerItem);
    const equivalentTreesPlanted = Math.round((totalCo2Saved / 21) * 10) / 10; // 1 tree absorbs ~21kg CO2/year
    const drinkingWaterDays = Math.round(totalWaterSaved / 3); // 3L drinking water per person/day

    res.json({
      success: true,
      data: {
        itemsSwapped,
        totalCo2SavedKg: totalCo2Saved,
        totalWaterSavedLiters: totalWaterSaved,
        landfillDivertedKg: Number(landfillDivertedKg.toFixed(2)),
        equivalentTreesPlanted,
        drinkingWaterDays,
        badgeTitle: itemsSwapped >= 10 ? "🌿 Green Aravalli Champion" : itemsSwapped >= 5 ? "🌱 Western Ghats Guardian" : "🍃 Conscious Swapper",
        impactMessage: `By swapping ${itemsSwapped} item(s), you saved enough drinking water for one Indian citizen for ${drinkingWaterDays} days and prevented ${totalCo2Saved} kg of carbon emissions!`
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate circular impact' });
  }
});

module.exports = router;
