require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clothing-swap');
    console.log('Connected to DB...');

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});

    // Create users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const user1 = await User.create({
      name: 'Aanya Sharma',
      email: 'aanya@example.com',
      password,
      location: 'Mumbai, India',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Rohan Kapoor',
      email: 'rohan@example.com',
      password,
      location: 'Delhi, India',
      role: 'user'
    });

    const admin = await User.create({
      name: 'Vikram Singh',
      email: 'admin@example.com',
      password,
      location: 'Bengaluru, India',
      role: 'admin'
    });

    // Create premium Indian fashion items
    await Item.create([
      {
        title: 'Authentic Banarasi Silk Saree',
        description: 'Exquisite hand-woven Banarasi pure silk saree with intricate gold zari work. A true heirloom piece that captures the essence of Varanasi.',
        brand: 'Weavers of Varanasi',
        size: 'Free Size',
        condition: 'Like New',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Varanasi, India',
        imageUrl: '/images/fashion_item_1_1779264232059.png',
        ownerId: user1._id,
        isFeatured: true
      },
      {
        title: 'Sabyasachi Bridal Velvet Lehenga',
        description: 'Breathtaking maroon velvet lehenga by Sabyasachi, adorned with zardosi and sequence embroidery. Perfect condition, worn only once for a few hours.',
        brand: 'Sabyasachi',
        size: 'M',
        condition: 'Like New',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Mumbai, India',
        imageUrl: '/images/fashion_item_2_1779264409786.png',
        ownerId: user2._id,
        isFeatured: true
      },
      {
        title: 'Manish Malhotra Sequin Sherwani',
        description: 'A contemporary take on traditional menswear. Dazzling sequin and threadwork sherwani in ivory, complete with matching churidar.',
        brand: 'Manish Malhotra',
        size: 'L',
        condition: 'Good',
        category: 'Outerwear',
        suggestedValue: 'Premium',
        location: 'Delhi, India',
        imageUrl: '/images/fashion_item_3_1779264437570.png',
        ownerId: user1._id,
        isFeatured: true
      },
      {
        title: 'Anita Dongre Hand-Painted Kurta',
        description: 'Sustainable luxury at its finest. A beautiful hand-painted and block-printed cotton silk kurta set with a matching dupatta.',
        brand: 'Anita Dongre',
        size: 'S',
        condition: 'Good',
        category: 'Tops',
        suggestedValue: 'High',
        location: 'Jaipur, India',
        imageUrl: '/images/fashion_item_4.png',
        ownerId: user2._id,
        isFeatured: false
      },
      {
        title: 'Kanjeevaram Silk Kanjivaram',
        description: 'A traditional Kanjeevaram silk saree from Tamil Nadu in a stunning emerald green with a heavy temple border in pure silver and gold zari.',
        brand: 'Nalli Silks',
        size: 'Free Size',
        condition: 'Like New',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Chennai, India',
        imageUrl: '/images/fashion_item_5.png',
        ownerId: user1._id,
        isFeatured: true
      },
      {
        title: 'Tarun Tahiliani Draped Gown',
        description: 'Indo-western draped concept gown in blush pink. Exquisitely embellished with Swarvoski crystals. Ideal for cocktail receptions.',
        brand: 'Tarun Tahiliani',
        size: 'M',
        condition: 'Good',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Bengaluru, India',
        imageUrl: '/images/fashion_item_6.png',
        ownerId: user2._id,
        isFeatured: false
      },
      {
        title: 'Raw Mango Chanderi Silk Saree',
        description: 'Minimalist yet striking Chanderi silk saree with silver motifs. Lightweight and incredibly elegant for day events.',
        brand: 'Raw Mango',
        size: 'Free Size',
        condition: 'Like New',
        category: 'Dresses',
        suggestedValue: 'High',
        location: 'Mumbai, India',
        imageUrl: '/images/fashion_item_7.png',
        ownerId: user1._id,
        isFeatured: false
      },
      {
        title: 'Rahul Mishra Hand-Embroidered Jacket',
        description: 'A masterpiece of 3D hand embroidery showcasing floral motifs on a sheer organza jacket.',
        brand: 'Rahul Mishra',
        size: 'One Size',
        condition: 'Like New',
        category: 'Outerwear',
        suggestedValue: 'Premium',
        location: 'Delhi, India',
        imageUrl: '/images/fashion_item_1_1779264232059.png',
        ownerId: user2._id,
        isFeatured: true
      },
      {
        title: 'Pashmina Handloom Shawl',
        description: '100% pure authentic Kashmiri Pashmina shawl featuring intricate Sozni embroidery. Incredibly soft and warm.',
        brand: 'Kashmiri Heritage',
        size: 'Free Size',
        condition: 'Good',
        category: 'Accessories',
        suggestedValue: 'Premium',
        location: 'Srinagar, India',
        imageUrl: '/images/fashion_item_2_1779264409786.png',
        ownerId: user1._id,
        isFeatured: false
      },
      {
        title: 'Ajrakh Block Print Co-Ord Set',
        description: 'Contemporary co-ord set made from naturally dyed Ajrakh printed modal silk. Perfect fusion of comfort and heritage.',
        brand: 'FabIndia',
        size: 'L',
        condition: 'Fair',
        category: 'Tops',
        suggestedValue: 'Medium',
        location: 'Ahmedabad, India',
        imageUrl: '/images/fashion_item_3_1779264437570.png',
        ownerId: user2._id,
        isFeatured: false
      },
      {
        title: 'Kalamkari Hand-Painted Dupatta',
        description: 'Traditional Kalamkari storytelling painted by hand on pure silk. A gorgeous accessory to elevate any plain outfit.',
        brand: 'Artisans of Andhra',
        size: 'One Size',
        condition: 'Like New',
        category: 'Accessories',
        suggestedValue: 'High',
        location: 'Hyderabad, India',
        imageUrl: '/images/fashion_item_4.png',
        ownerId: user1._id,
        isFeatured: false
      },
      {
        title: 'Abu Jani Sandeep Khosla Anarkali',
        description: 'A regal ivory Anarkali suit featuring their signature mirror work and chikankari detailing. Utterly majestic.',
        brand: 'Abu Jani Sandeep Khosla',
        size: 'M',
        condition: 'Good',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Mumbai, India',
        imageUrl: '/images/fashion_item_5.png',
        ownerId: user2._id,
        isFeatured: true
      },
      {
        title: 'Gaurav Gupta Sculpted Couture Gown',
        description: 'Iconic structured swirl gown in deep midnight blue. Features a dramatic train and signature structural pleats. Worn once for a red carpet event.',
        brand: 'Gaurav Gupta',
        size: 'S',
        condition: 'Like New',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Mumbai, India',
        imageUrl: '/images/fashion_item_1_1779264232059.png',
        ownerId: user1._id,
        isFeatured: true
      },
      {
        title: 'Ritu Kumar Vintage Anarkali',
        description: 'A classic Ritu Kumar heavy silk Anarkali in rich maroon, featuring classic zardozi work from her heritage collection.',
        brand: 'Ritu Kumar',
        size: 'L',
        condition: 'Good',
        category: 'Dresses',
        suggestedValue: 'High',
        location: 'Kolkata, India',
        imageUrl: '/images/fashion_item_2_1779264409786.png',
        ownerId: user2._id,
        isFeatured: false
      },
      {
        title: 'Masaba Gupta Print Co-ord Set',
        description: 'Quirky and bold signature cow-print co-ord set by Masaba. Extremely comfortable crepe fabric, perfect for a casual chic day out.',
        brand: 'House of Masaba',
        size: 'M',
        condition: 'Fair',
        category: 'Tops',
        suggestedValue: 'Medium',
        location: 'Pune, India',
        imageUrl: '/images/fashion_item_3_1779264437570.png',
        ownerId: user1._id,
        isFeatured: false
      },
      {
        title: 'Phulkari Embroidered Bagh Dupatta',
        description: 'Authentic handmade Phulkari Bagh from Punjab. The entire surface is covered in vibrant silk thread embroidery. A stunning heritage textile.',
        brand: 'Punjabi Heritage',
        size: 'One Size',
        condition: 'Like New',
        category: 'Accessories',
        suggestedValue: 'High',
        location: 'Amritsar, India',
        imageUrl: '/images/fashion_item_4_1779265376256.png',
        ownerId: user2._id,
        isFeatured: true
      },
      {
        title: 'Kunal Rawal Signature Kurta',
        description: 'Menswear asymmetric hem kurta in olive green with subtle geometric embroidery. A highly sought after contemporary piece.',
        brand: 'Kunal Rawal',
        size: 'M',
        condition: 'Good',
        category: 'Tops',
        suggestedValue: 'High',
        location: 'Mumbai, India',
        imageUrl: '/images/fashion_item_5_1779265393750.png',
        ownerId: user1._id,
        isFeatured: false
      },
      {
        title: 'Anita Dongre Silver Jadau Choker',
        description: 'Exquisite handcrafted silver jadau choker from Anita Dongre Pink City collection. Encrusted with moissanite polki and pearls.',
        brand: 'Anita Dongre Pink City',
        size: 'One Size',
        condition: 'Like New',
        category: 'Accessories',
        suggestedValue: 'Premium',
        location: 'Jaipur, India',
        imageUrl: '/images/fashion_item_6_1779265409254.png',
        ownerId: user2._id,
        isFeatured: true
      },
      {
        title: 'Anamika Khanna Cape and Dhoti Set',
        description: 'Signature Anamika Khanna bohemian luxury. An intricately embroidered cape paired with draped dhoti pants in blush tones.',
        brand: 'Anamika Khanna',
        size: 'S',
        condition: 'Good',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Delhi, India',
        imageUrl: '/images/fashion_item_7_1779265426864.png',
        ownerId: user1._id,
        isFeatured: true
      },
      {
        title: 'Suneet Varma Crystal Corset Saree',
        description: 'A dazzling pre-draped saree attached to a fully Swarovski crystal-encrusted corset. Ultimate glamour for a reception.',
        brand: 'Suneet Varma',
        size: 'S',
        condition: 'Like New',
        category: 'Dresses',
        suggestedValue: 'Premium',
        location: 'Delhi, India',
        imageUrl: '/images/fashion_item_1_1779264232059.png',
        ownerId: user2._id,
        isFeatured: false
      }
    ]);

    console.log('Database Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
