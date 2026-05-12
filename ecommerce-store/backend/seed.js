require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/db');

const seed = async () => {
  try {
    // Clear all data
    await db.users.remove({}, { multi: true });
    await db.products.remove({}, { multi: true });
    await db.orders.remove({}, { multi: true });
    console.log('🗑️  Cleared existing data');

    // Create admin
    const adminId = uuidv4();
    const now = new Date().toISOString();
    await db.users.insert({
      _id: adminId, name: 'Admin User', email: 'admin@store.com',
      password: await bcrypt.hash('admin123', 12), role: 'admin',
      createdAt: now, updatedAt: now
    });
    console.log('👤 Admin: admin@store.com / admin123');

    // Create user
    const userId = uuidv4();
    await db.users.insert({
      _id: userId, name: 'John Doe', email: 'user@store.com',
      password: await bcrypt.hash('user123', 12), role: 'user',
      address: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
      createdAt: now, updatedAt: now
    });
    console.log('👤 User: user@store.com / user123');

    // Create products
    const products = [
      { name: 'iPhone 15 Pro', description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system with 48MP main sensor.', price: 999, category: 'Electronics', brand: 'Apple', stock: 50, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500'], rating: 4.8, numReviews: 245, featured: true },
      { name: 'MacBook Pro 16"', description: 'Powerful laptop with M3 Max chip, 16-inch Liquid Retina XDR display, and up to 22 hours battery life.', price: 2499, category: 'Electronics', brand: 'Apple', stock: 30, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'], rating: 4.9, numReviews: 189, featured: true },
      { name: 'Sony WH-1000XM5', description: 'Industry-leading noise canceling wireless headphones with premium sound quality and 30-hour battery.', price: 399, category: 'Electronics', brand: 'Sony', stock: 75, images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'], rating: 4.7, numReviews: 512, featured: true },
      { name: 'Samsung 55" QLED TV', description: '4K QLED Smart TV with Quantum HDR, Object Tracking Sound, and built-in streaming apps.', price: 899, category: 'Electronics', brand: 'Samsung', stock: 25, images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'], rating: 4.6, numReviews: 156, featured: false },
      { name: 'Nike Air Max 270', description: 'Comfortable running shoes with Max Air cushioning, breathable mesh upper, and rubber outsole.', price: 150, category: 'Clothing', brand: 'Nike', stock: 100, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'], rating: 4.5, numReviews: 423, featured: false },
      { name: "Levi's 501 Original Jeans", description: "Classic straight fit jeans with button fly, the original since 1873. Made with 100% cotton denim.", price: 69, category: 'Clothing', brand: "Levi's", stock: 150, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'], rating: 4.4, numReviews: 678, featured: false },
      { name: 'The Lean Startup', description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses by Eric Ries.", price: 16, category: 'Books', brand: 'Crown Business', stock: 200, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'], rating: 4.6, numReviews: 1234, featured: false },
      { name: 'Atomic Habits', description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear. Over 10 million copies sold.', price: 14, category: 'Books', brand: 'Avery', stock: 180, images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500'], rating: 4.9, numReviews: 2156, featured: true },
      { name: 'Dyson V15 Detect', description: 'Cordless vacuum with laser dust detection, LCD screen showing particle count, and 60 min runtime.', price: 649, category: 'Home & Garden', brand: 'Dyson', stock: 40, images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'], rating: 4.7, numReviews: 289, featured: false },
      { name: 'Instant Pot Duo 7-in-1', description: 'Electric pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.', price: 89, category: 'Home & Garden', brand: 'Instant Pot', stock: 120, images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'], rating: 4.8, numReviews: 3421, featured: false },
      { name: 'Yoga Mat Premium', description: 'Non-slip exercise mat with extra 6mm cushioning for yoga, pilates, and fitness. Includes carrying strap.', price: 29, category: 'Sports', brand: 'Gaiam', stock: 200, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'], rating: 4.3, numReviews: 567, featured: false },
      { name: 'LEGO Star Wars Millennium Falcon', description: 'Ultimate Collector Series building set with 7,541 pieces. Highly detailed replica of the iconic spaceship.', price: 849, category: 'Toys', brand: 'LEGO', stock: 15, images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'], rating: 5.0, numReviews: 89, featured: true }
    ];

    const createdProducts = [];
    for (const p of products) {
      const id = uuidv4();
      const product = await db.products.insert({ _id: id, ...p, createdBy: adminId, createdAt: now, updatedAt: now });
      createdProducts.push(product);
    }
    console.log(`📦 Created ${createdProducts.length} products`);

    // Create sample order
    const orderId = uuidv4();
    await db.orders.insert({
      _id: orderId,
      orderNumber: 'ORD-000001',
      userId,
      items: [
        { productId: createdProducts[0]._id, product: createdProducts[0]._id, name: createdProducts[0].name, image: createdProducts[0].images[0], price: createdProducts[0].price, quantity: 1 },
        { productId: createdProducts[2]._id, product: createdProducts[2]._id, name: createdProducts[2].name, image: createdProducts[2].images[0], price: createdProducts[2].price, quantity: 2 }
      ],
      shippingAddress: { name: 'John Doe', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' },
      paymentMethod: 'card', paymentStatus: 'paid', orderStatus: 'shipped',
      subtotal: 1797, shippingCost: 0, tax: 143.76, total: 1940.76,
      trackingNumber: 'TRK123456789', createdAt: now, updatedAt: now
    });
    console.log('📋 Created sample order: ORD-000001');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: admin@store.com / admin123');
    console.log('   User:  user@store.com / user123\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

// Give DB time to initialize
setTimeout(seed, 500);
