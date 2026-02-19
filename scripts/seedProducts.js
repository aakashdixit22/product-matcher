const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const Product = require('./ProductModel');


require('dotenv').config({ path: path.join(__dirname, '..', '.env') });


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-matcher';


// Sample products data 
const productsData = [
  // Shoes (15 products)
  { name: 'Classic White Sneakers', category: 'Shoes', brand: 'Nike', color: 'White', price: 89.99, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', description: 'Comfortable white sneakers for everyday wear' },
  { name: 'Black Running Shoes', category: 'Shoes', brand: 'Adidas', color: 'Black', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'High-performance running shoes' },
  { name: 'Red Canvas Sneakers', category: 'Shoes', brand: 'Converse', color: 'Red', price: 65.00, imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400', description: 'Classic canvas sneakers in vibrant red' },
  { name: 'Brown Leather Boots', category: 'Shoes', brand: 'Timberland', color: 'Brown', price: 180.00, imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400', description: 'Durable leather boots for outdoor adventures' },
  { name: 'Blue Slip-On Shoes', category: 'Shoes', brand: 'Vans', color: 'Blue', price: 55.00, imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400', description: 'Easy slip-on shoes for casual style' },
  { name: 'Gray Athletic Shoes', category: 'Shoes', brand: 'New Balance', color: 'Gray', price: 95.00, imageUrl: 'https://images.unsplash.com/photo-1605408499391-6368c628ef42?w=400', description: 'Versatile athletic shoes' },
  { name: 'Pink High-Top Sneakers', category: 'Shoes', brand: 'Puma', color: 'Pink', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400', description: 'Stylish high-top sneakers' },
  { name: 'Black Formal Shoes', category: 'Shoes', brand: 'Clarks', color: 'Black', price: 110.00, imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400', description: 'Professional formal shoes' },
  { name: 'Green Trail Runners', category: 'Shoes', brand: 'Salomon', color: 'Green', price: 135.00, imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', description: 'Trail running shoes' },
  { name: 'Yellow Summer Sandals', category: 'Shoes', brand: 'Birkenstock', color: 'Yellow', price: 70.00, imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400', description: 'Comfortable summer sandals' },
  { name: 'Navy Blue Boat Shoes', category: 'Shoes', brand: 'Sperry', color: 'Navy', price: 90.00, imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400', description: 'Classic boat shoes' },
  { name: 'White Tennis Shoes', category: 'Shoes', brand: 'Reebok', color: 'White', price: 80.00, imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400', description: 'Tennis court ready' },
  { name: 'Orange Basketball Shoes', category: 'Shoes', brand: 'Jordan', color: 'Orange', price: 160.00, imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400', description: 'High-performance basketball shoes' },
  { name: 'Beige Loafers', category: 'Shoes', brand: 'Gucci', color: 'Beige', price: 450.00, imageUrl: 'https://images.unsplash.com/photo-1582897432894-f8469c12b64c?w=400', description: 'Luxury loafers' },
  { name: 'Purple Training Shoes', category: 'Shoes', brand: 'Under Armour', color: 'Purple', price: 100.00, imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400', description: 'Cross-training shoes' },

  // Bags (15 products)
  { name: 'Black Leather Backpack', category: 'Bags', brand: 'Herschel', color: 'Black', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Premium leather backpack' },
  { name: 'Brown Messenger Bag', category: 'Bags', brand: 'Fossil', color: 'Brown', price: 95.00, imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', description: 'Classic messenger bag' },
  { name: 'Pink Tote Bag', category: 'Bags', brand: 'Michael Kors', color: 'Pink', price: 180.00, imageUrl: 'https://images.unsplash.com/photo-1590739225024-20e57db5e069?w=400', description: 'Elegant tote bag' },
  { name: 'Gray Laptop Bag', category: 'Bags', brand: 'Samsonite', color: 'Gray', price: 110.00, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Professional laptop bag' },
  { name: 'Blue Canvas Backpack', category: 'Bags', brand: 'JanSport', color: 'Blue', price: 45.00, imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400', description: 'Durable canvas backpack' },
  { name: 'Red Crossbody Bag', category: 'Bags', brand: 'Coach', color: 'Red', price: 250.00, imageUrl: 'https://images.unsplash.com/photo-1564422167509-4f10f0e5664e?w=400', description: 'Stylish crossbody bag' },
  { name: 'Green Hiking Backpack', category: 'Bags', brand: 'The North Face', color: 'Green', price: 140.00, imageUrl: 'https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400', description: 'Adventure-ready backpack' },
  { name: 'White Purse', category: 'Bags', brand: 'Kate Spade', color: 'White', price: 200.00, imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400', description: 'Chic white purse' },
  { name: 'Black Duffle Bag', category: 'Bags', brand: 'Adidas', color: 'Black', price: 70.00, imageUrl: 'https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=400', description: 'Gym duffle bag' },
  { name: 'Tan Shoulder Bag', category: 'Bags', brand: 'Longchamp', color: 'Tan', price: 190.00, imageUrl: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=400', description: 'Classic shoulder bag' },
  { name: 'Navy Travel Bag', category: 'Bags', brand: 'Tumi', color: 'Navy', price: 280.00, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', description: 'Premium travel bag' },
  { name: 'Yellow Beach Bag', category: 'Bags', brand: 'Roxy', color: 'Yellow', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1590739225024-20e57db5e069?w=400', description: 'Summer beach bag' },
  { name: 'Purple Mini Backpack', category: 'Bags', brand: 'Fjallraven', color: 'Purple', price: 85.00, imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400', description: 'Compact mini backpack' },
  { name: 'Orange Gym Bag', category: 'Bags', brand: 'Nike', color: 'Orange', price: 55.00, imageUrl: 'https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=400', description: 'Sporty gym bag' },
  { name: 'Olive Green Satchel', category: 'Bags', brand: 'Cambridge', color: 'Olive', price: 130.00, imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400', description: 'Vintage-style satchel' },

  // Watches (10 products)
  { name: 'Silver Smartwatch', category: 'Watches', brand: 'Apple', color: 'Silver', price: 399.00, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: 'Latest smartwatch technology' },
  { name: 'Gold Luxury Watch', category: 'Watches', brand: 'Rolex', color: 'Gold', price: 8500.00, imageUrl: 'https://images.unsplash.com/photo-1587836374058-4ec0b0d6c3c7?w=400', description: 'Luxury timepiece' },
  { name: 'Black Sports Watch', category: 'Watches', brand: 'Garmin', color: 'Black', price: 250.00, imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400', description: 'Fitness tracking watch' },
  { name: 'Blue Diver Watch', category: 'Watches', brand: 'Seiko', color: 'Blue', price: 450.00, imageUrl: 'https://images.unsplash.com/photo-1618379565261-0325d2ce0e89?w=400', description: 'Professional dive watch' },
  { name: 'Rose Gold Watch', category: 'Watches', brand: 'Fossil', color: 'Rose Gold', price: 150.00, imageUrl: 'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=400', description: 'Elegant rose gold design' },
  { name: 'Green Military Watch', category: 'Watches', brand: 'Casio', color: 'Green', price: 90.00, imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400', description: 'Rugged military style' },
  { name: 'White Ceramic Watch', category: 'Watches', brand: 'Rado', color: 'White', price: 1200.00, imageUrl: 'https://images.unsplash.com/photo-1639006576606-5b2c85d2e6a8?w=400', description: 'Premium ceramic watch' },
  { name: 'Brown Leather Watch', category: 'Watches', brand: 'Timex', color: 'Brown', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', description: 'Classic leather strap' },
  { name: 'Purple Fitness Tracker', category: 'Watches', brand: 'Fitbit', color: 'Purple', price: 180.00, imageUrl: 'https://images.unsplash.com/photo-1576243387389-02df7dad96df?w=400', description: 'Advanced fitness tracker' },
  { name: 'Gray Chronograph', category: 'Watches', brand: 'Tag Heuer', color: 'Gray', price: 2500.00, imageUrl: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400', description: 'Precision chronograph' },

  // Sunglasses (10 products)
  { name: 'Classic Black Aviators', category: 'Sunglasses', brand: 'Ray-Ban', color: 'Black', price: 150.00, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', description: 'Timeless aviator style' },
  { name: 'Tortoise Wayfarers', category: 'Sunglasses', brand: 'Ray-Ban', color: 'Tortoise', price: 160.00, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', description: 'Classic wayfarer design' },
  { name: 'Rose Gold Cat Eye', category: 'Sunglasses', brand: 'Prada', color: 'Rose Gold', price: 280.00, imageUrl: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400', description: 'Fashionable cat eye' },
  { name: 'Blue Mirror Lens', category: 'Sunglasses', brand: 'Oakley', color: 'Blue', price: 190.00, imageUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400', description: 'Sports sunglasses' },
  { name: 'Brown Round Frames', category: 'Sunglasses', brand: 'Persol', color: 'Brown', price: 220.00, imageUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400', description: 'Vintage round frames' },
  { name: 'White Oversized', category: 'Sunglasses', brand: 'Gucci', color: 'White', price: 350.00, imageUrl: 'https://images.unsplash.com/photo-1609010697446-11f2155278f0?w=400', description: 'Oversized luxury frames' },
  { name: 'Green Sport Sunglasses', category: 'Sunglasses', brand: 'Nike', color: 'Green', price: 110.00, imageUrl: 'https://images.unsplash.com/photo-1556306535-38febf6782e7?w=400', description: 'Athletic performance' },
  { name: 'Purple Gradient Lens', category: 'Sunglasses', brand: 'Versace', color: 'Purple', price: 300.00, imageUrl: 'https://images.unsplash.com/photo-1585913783138-f1c5a8c7c0d8?w=400', description: 'Designer gradient lens' },
  { name: 'Yellow Tinted Glasses', category: 'Sunglasses', brand: 'Gentle Monster', color: 'Yellow', price: 240.00, imageUrl: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400', description: 'Trendy tinted lenses' },
  { name: 'Silver Pilot Sunglasses', category: 'Sunglasses', brand: 'Maui Jim', color: 'Silver', price: 270.00, imageUrl: 'https://images.unsplash.com/photo-1559733551-efc7fef9d9f9?w=400', description: 'Polarized pilot style' },

  // Electronics (5 products)
  { name: 'Wireless Headphones', category: 'Electronics', brand: 'Sony', color: 'Black', price: 280.00, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', description: 'Premium wireless audio' },
  { name: 'Smartphone', category: 'Electronics', brand: 'Samsung', color: 'Blue', price: 899.00, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', description: 'Latest smartphone model' },
  { name: 'Tablet Device', category: 'Electronics', brand: 'iPad', color: 'Silver', price: 599.00, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', description: 'Portable tablet' },
  { name: 'Bluetooth Speaker', category: 'Electronics', brand: 'JBL', color: 'Red', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', description: 'Portable speaker' },
  { name: 'Laptop Computer', category: 'Electronics', brand: 'MacBook', color: 'Space Gray', price: 1299.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', description: 'Professional laptop' },

  // Vehicles (8 products)
  { name: 'Red Sports Car', category: 'Vehicles', brand: 'Ferrari', color: 'Red', price: 250000.00, imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400', description: 'High-performance sports car' },
  { name: 'Black SUV', category: 'Vehicles', brand: 'Range Rover', color: 'Black', price: 85000.00, imageUrl: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400', description: 'Luxury SUV' },
  { name: 'White Sedan', category: 'Vehicles', brand: 'Tesla', color: 'White', price: 45000.00, imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400', description: 'Electric sedan' },
  { name: 'Blue Motorcycle', category: 'Vehicles', brand: 'Yamaha', color: 'Blue', price: 12000.00, imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400', description: 'Sport motorcycle' },
  { name: 'Silver Convertible', category: 'Vehicles', brand: 'Porsche', color: 'Silver', price: 95000.00, imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', description: 'Luxury convertible' },
  { name: 'Green Off-Road Jeep', category: 'Vehicles', brand: 'Jeep', color: 'Green', price: 55000.00, imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400', description: 'Adventure off-road vehicle' },
  { name: 'Yellow Sports Bike', category: 'Vehicles', brand: 'Ducati', color: 'Yellow', price: 18000.00, imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400', description: 'Racing motorcycle' },
  { name: 'Gray Pickup Truck', category: 'Vehicles', brand: 'Ford', color: 'Gray', price: 42000.00, imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400', description: 'Heavy-duty pickup truck' },
];

// Python API URL
const PYTHON_API_URL = 'http://localhost:5000';

// Generate embedding function using Python API
async function generateEmbedding(imageUrl) {
  try {
    console.log(`Generating embedding for: ${imageUrl}`);
    
    const response = await axios.post(`${PYTHON_API_URL}/generate-embedding`, {
      imageUrl: imageUrl
    }, {
      timeout: 15000,
    });
    
    return response.data.embedding;
  } catch (error) {
    console.error(`Error processing image ${imageUrl}:`, error.message);
    throw error;
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Check if Python API is running
    console.log('🔍 Checking Python API connection...');
    try {
      const healthCheck = await axios.get(`${PYTHON_API_URL}/health`);
      console.log(`✅ Python API is running: ${healthCheck.data.model}`);
    } catch (error) {
      console.error('❌ Cannot connect to Python API at', PYTHON_API_URL);
      console.error('Please start the Python API first:');
      console.error('  cd python-api');
      console.error('  python app.py');
      process.exit(1);
    }
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');
    
    // Process products one by one to generate embeddings
    const productsWithEmbeddings = [];
    
    for (let i = 0; i < productsData.length; i++) {
      const product = productsData[i];
      console.log(`Processing ${i + 1}/${productsData.length}: ${product.name}`);
      
      try {
        const embedding = await generateEmbedding(product.imageUrl);
        productsWithEmbeddings.push({
          ...product,
          embedding,
        });
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to process ${product.name}:`, error.message);
      }
    }
    
    // Insert all products
    const insertedProducts = await Product.insertMany(productsWithEmbeddings);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);
    
    // Display summary
    const categories = await Product.distinct('category');
    console.log('\n📊 Summary:');
    for (const category of categories) {
      const count = await Product.countDocuments({ category });
      console.log(`  - ${category}: ${count} products`);
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// Run the seeding
seedDatabase();
