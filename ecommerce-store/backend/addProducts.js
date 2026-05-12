require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const db = require('./config/db');

const addProducts = async () => {
  try {
    // Get admin user id
    const admin = await db.users.findOne({ role: 'admin' });
    if (!admin) { console.error('No admin found. Run seed.js first.'); process.exit(1); }

    const now = new Date().toISOString();

    const newProducts = [
      // ── ELECTRONICS ──────────────────────────────────────────
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Android smartphone with 200MP camera, built-in S Pen, Snapdragon 8 Gen 3, and 5000mAh battery.',
        price: 124999, category: 'Electronics', brand: 'Samsung', stock: 40,
        images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'],
        rating: 4.7, numReviews: 312, featured: true
      },
      {
        name: 'OnePlus 12',
        description: 'Snapdragon 8 Gen 3, Hasselblad camera system, 100W SUPERVOOC charging, and 6.82" AMOLED display.',
        price: 64999, category: 'Electronics', brand: 'OnePlus', stock: 60,
        images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
        rating: 4.6, numReviews: 198, featured: false
      },
      {
        name: 'iPad Pro 12.9" M2',
        description: 'Apple M2 chip, Liquid Retina XDR display, ProMotion 120Hz, Wi-Fi 6E, and USB-C with Thunderbolt.',
        price: 112900, category: 'Electronics', brand: 'Apple', stock: 35,
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'],
        rating: 4.9, numReviews: 145, featured: true
      },
      {
        name: 'Dell XPS 15 Laptop',
        description: 'Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 4070, 15.6" OLED 3.5K display. Perfect for creators.',
        price: 189999, category: 'Electronics', brand: 'Dell', stock: 20,
        images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500'],
        rating: 4.7, numReviews: 89, featured: false
      },
      {
        name: 'Canon EOS R6 Mark II',
        description: 'Full-frame mirrorless camera with 40fps burst, 6K RAW video, in-body stabilization, and dual card slots.',
        price: 229999, category: 'Electronics', brand: 'Canon', stock: 15,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500'],
        rating: 4.8, numReviews: 67, featured: true
      },
      {
        name: 'JBL Charge 5 Speaker',
        description: 'Portable Bluetooth speaker with 20 hours playtime, IP67 waterproof, and built-in power bank.',
        price: 14999, category: 'Electronics', brand: 'JBL', stock: 90,
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
        rating: 4.5, numReviews: 534, featured: false
      },
      {
        name: 'Apple Watch Series 9',
        description: 'S9 chip, Always-On Retina display, blood oxygen sensor, ECG, crash detection, and 18-hour battery.',
        price: 41900, category: 'Electronics', brand: 'Apple', stock: 55,
        images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500'],
        rating: 4.8, numReviews: 423, featured: true
      },
      {
        name: 'Logitech MX Master 3S',
        description: 'Advanced wireless mouse with 8K DPI sensor, MagSpeed scroll wheel, USB-C charging, and multi-device support.',
        price: 9995, category: 'Electronics', brand: 'Logitech', stock: 120,
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500'],
        rating: 4.7, numReviews: 876, featured: false
      },
      {
        name: 'Kindle Paperwhite 11th Gen',
        description: '6.8" display, adjustable warm light, 10 weeks battery, IPX8 waterproof, 8GB storage, and glare-free.',
        price: 13999, category: 'Electronics', brand: 'Amazon', stock: 100,
        images: ['https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500'],
        rating: 4.6, numReviews: 1245, featured: false
      },
      {
        name: 'Realme Buds Air 5 Pro',
        description: 'Active Noise Cancellation, 50dB ANC, 360° Spatial Audio, 38 hours total playback, and LDAC support.',
        price: 4999, category: 'Electronics', brand: 'Realme', stock: 150,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'],
        rating: 4.3, numReviews: 678, featured: false
      },

      // ── CLOTHING ─────────────────────────────────────────────
      {
        name: 'Allen Solly Men\'s Formal Shirt',
        description: 'Premium cotton formal shirt with slim fit, wrinkle-resistant fabric, and classic collar. Office-ready style.',
        price: 1299, category: 'Clothing', brand: 'Allen Solly', stock: 200,
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500'],
        rating: 4.3, numReviews: 456, featured: false
      },
      {
        name: 'Fabindia Kurta Set',
        description: 'Handcrafted cotton kurta with matching pyjama. Block print design, comfortable fit for festive occasions.',
        price: 2499, category: 'Clothing', brand: 'Fabindia', stock: 120,
        images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'],
        rating: 4.5, numReviews: 234, featured: true
      },
      {
        name: 'Puma Men\'s Running Jacket',
        description: 'Lightweight windbreaker with moisture-wicking technology, reflective details, and zip pockets.',
        price: 3499, category: 'Clothing', brand: 'Puma', stock: 80,
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'],
        rating: 4.4, numReviews: 189, featured: false
      },
      {
        name: 'W Women\'s Anarkali Kurta',
        description: 'Elegant floral print Anarkali kurta in soft georgette fabric. Perfect for casual and semi-formal occasions.',
        price: 1799, category: 'Clothing', brand: 'W', stock: 150,
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'],
        rating: 4.4, numReviews: 312, featured: false
      },
      {
        name: 'Adidas Originals Hoodie',
        description: 'Classic trefoil logo hoodie in premium fleece. Kangaroo pocket, ribbed cuffs, and relaxed fit.',
        price: 4999, category: 'Clothing', brand: 'Adidas', stock: 90,
        images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500'],
        rating: 4.6, numReviews: 567, featured: false
      },
      {
        name: 'Raymond Men\'s Blazer',
        description: 'Premium wool-blend blazer with notch lapel, two-button closure, and slim fit. Ideal for formal events.',
        price: 8999, category: 'Clothing', brand: 'Raymond', stock: 60,
        images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500'],
        rating: 4.5, numReviews: 145, featured: true
      },
      {
        name: 'Biba Women\'s Salwar Suit',
        description: 'Vibrant printed cotton salwar suit with dupatta. Comfortable everyday wear with ethnic charm.',
        price: 1999, category: 'Clothing', brand: 'Biba', stock: 130,
        images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500'],
        rating: 4.3, numReviews: 289, featured: false
      },
      {
        name: 'Woodland Men\'s Trekking Shoes',
        description: 'Genuine leather trekking shoes with anti-skid rubber sole, waterproof lining, and ankle support.',
        price: 4495, category: 'Clothing', brand: 'Woodland', stock: 75,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        rating: 4.4, numReviews: 423, featured: false
      },

      // ── TOYS ─────────────────────────────────────────────────
      {
        name: 'Hot Wheels 20-Car Gift Pack',
        description: 'Set of 20 die-cast Hot Wheels cars in 1:64 scale. Includes exclusive models and collector favorites.',
        price: 1299, category: 'Toys', brand: 'Hot Wheels', stock: 200,
        images: ['https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500'],
        rating: 4.7, numReviews: 892, featured: false
      },
      {
        name: 'Funskool Monopoly Classic',
        description: 'The classic property trading board game. Includes game board, tokens, cards, houses, hotels, and dice.',
        price: 799, category: 'Toys', brand: 'Funskool', stock: 150,
        images: ['https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500'],
        rating: 4.5, numReviews: 1234, featured: false
      },
      {
        name: 'LEGO Technic Bugatti Chiron',
        description: '3,599-piece LEGO Technic set with working W16 engine, gearbox, and aerodynamic rear wing.',
        price: 34999, category: 'Toys', brand: 'LEGO', stock: 20,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
        rating: 4.9, numReviews: 156, featured: true
      },
      {
        name: 'Barbie Dreamhouse',
        description: '3-story dollhouse with 8 rooms, elevator, pool, slide, and 70+ accessories. Lights and sounds included.',
        price: 12999, category: 'Toys', brand: 'Barbie', stock: 35,
        images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500'],
        rating: 4.6, numReviews: 234, featured: false
      },
      {
        name: 'Remote Control Racing Car',
        description: '1:16 scale RC car with 2.4GHz control, 25 km/h speed, rechargeable battery, and all-terrain tires.',
        price: 2499, category: 'Toys', brand: 'Webby', stock: 80,
        images: ['https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500'],
        rating: 4.3, numReviews: 345, featured: false
      },
      {
        name: 'Rubik\'s Cube 3x3',
        description: 'Original Rubik\'s Cube with smooth rotation mechanism. Classic puzzle toy for all ages.',
        price: 499, category: 'Toys', brand: "Rubik's", stock: 300,
        images: ['https://images.unsplash.com/photo-1591991731833-b4807cf7ef94?w=500'],
        rating: 4.6, numReviews: 2345, featured: false
      },
      {
        name: 'Nerf Elite 2.0 Blaster',
        description: 'Motorized Nerf blaster with 10-dart clip, 27m range, and tactical rail for accessories.',
        price: 1999, category: 'Toys', brand: 'Nerf', stock: 100,
        images: ['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500'],
        rating: 4.4, numReviews: 567, featured: false
      },

      // ── SPORTS ───────────────────────────────────────────────
      {
        name: 'Cosco Football Size 5',
        description: 'FIFA-approved match football with 32-panel design, butyl bladder, and durable PU outer casing.',
        price: 899, category: 'Sports', brand: 'Cosco', stock: 200,
        images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500'],
        rating: 4.4, numReviews: 678, featured: false
      },
      {
        name: 'Yonex Badminton Racket',
        description: 'Isometric head shape, graphite shaft, 85g weight. Ideal for intermediate to advanced players.',
        price: 2499, category: 'Sports', brand: 'Yonex', stock: 80,
        images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500'],
        rating: 4.6, numReviews: 456, featured: false
      },
      {
        name: 'Decathlon Resistance Bands Set',
        description: 'Set of 5 resistance bands (10-50 lbs), latex-free, with door anchor, handles, and ankle straps.',
        price: 1299, category: 'Sports', brand: 'Decathlon', stock: 150,
        images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500'],
        rating: 4.5, numReviews: 789, featured: false
      },
      {
        name: 'Nivia Cricket Bat English Willow',
        description: 'Grade 3 English Willow cricket bat with full-size blade, cane handle, and protective cover.',
        price: 3999, category: 'Sports', brand: 'Nivia', stock: 60,
        images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500'],
        rating: 4.3, numReviews: 234, featured: false
      },
      {
        name: 'Boldfit Gym Gloves',
        description: 'Anti-slip workout gloves with wrist support, breathable mesh back, and full palm protection.',
        price: 599, category: 'Sports', brand: 'Boldfit', stock: 250,
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'],
        rating: 4.2, numReviews: 1123, featured: false
      },
      {
        name: 'Lifelong Treadmill LLT09',
        description: 'Motorized treadmill with 2.5HP motor, 12 preset programs, LCD display, and foldable design.',
        price: 24999, category: 'Sports', brand: 'Lifelong', stock: 25,
        images: ['https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500'],
        rating: 4.4, numReviews: 189, featured: true
      },
      {
        name: 'Adidas Running Shoes Ultraboost',
        description: 'Boost midsole technology, Primeknit upper, Continental rubber outsole. Maximum energy return.',
        price: 14999, category: 'Sports', brand: 'Adidas', stock: 70,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        rating: 4.7, numReviews: 892, featured: true
      },

      // ── BOOKS ────────────────────────────────────────────────
      {
        name: 'Rich Dad Poor Dad',
        description: 'Robert Kiyosaki\'s personal finance classic. Learn what the rich teach their kids about money.',
        price: 299, category: 'Books', brand: 'Plata Publishing', stock: 300,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
        rating: 4.7, numReviews: 5678, featured: true
      },
      {
        name: 'The Psychology of Money',
        description: 'Morgan Housel explores how people think about money and timeless lessons on wealth and happiness.',
        price: 349, category: 'Books', brand: 'Harriman House', stock: 250,
        images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500'],
        rating: 4.8, numReviews: 3456, featured: true
      },
      {
        name: 'Wings of Fire - APJ Abdul Kalam',
        description: 'Autobiography of India\'s Missile Man and former President. An inspiring journey from Rameswaram to Rashtrapati Bhavan.',
        price: 199, category: 'Books', brand: 'Universities Press', stock: 400,
        images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500'],
        rating: 4.9, numReviews: 8901, featured: true
      },
      {
        name: 'Harry Potter Complete Box Set',
        description: 'All 7 Harry Potter books in a beautiful collector\'s box set. Perfect gift for fans of all ages.',
        price: 3499, category: 'Books', brand: 'Bloomsbury', stock: 80,
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
        rating: 5.0, numReviews: 4567, featured: true
      },
      {
        name: 'Deep Work by Cal Newport',
        description: 'Rules for focused success in a distracted world. Learn to produce at an elite level in less time.',
        price: 399, category: 'Books', brand: 'Grand Central Publishing', stock: 200,
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
        rating: 4.6, numReviews: 2134, featured: false
      },
      {
        name: 'Zero to One - Peter Thiel',
        description: 'Notes on startups, or how to build the future. Essential reading for entrepreneurs and innovators.',
        price: 449, category: 'Books', brand: 'Crown Business', stock: 180,
        images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'],
        rating: 4.5, numReviews: 1789, featured: false
      },
      {
        name: 'Ikigai: The Japanese Secret',
        description: 'The Japanese secret to a long and happy life. Find your purpose and live a fulfilling existence.',
        price: 249, category: 'Books', brand: 'Penguin Books', stock: 350,
        images: ['https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500'],
        rating: 4.4, numReviews: 3210, featured: false
      },

      // ── HOME & GARDEN ─────────────────────────────────────────
      {
        name: 'Philips Air Fryer HD9200',
        description: 'Rapid Air Technology, 4.1L capacity, 13 preset programs, digital display, and dishwasher-safe parts.',
        price: 8995, category: 'Home & Garden', brand: 'Philips', stock: 80,
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'],
        rating: 4.6, numReviews: 2345, featured: true
      },
      {
        name: 'Prestige Induction Cooktop',
        description: '2000W induction cooktop with 8 preset menus, auto-off, child lock, and feather touch controls.',
        price: 2999, category: 'Home & Garden', brand: 'Prestige', stock: 100,
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'],
        rating: 4.4, numReviews: 1567, featured: false
      },
      {
        name: 'Havells Ceiling Fan 1200mm',
        description: 'Energy-efficient BLDC motor ceiling fan with remote control, 5 speed settings, and 3-year warranty.',
        price: 4499, category: 'Home & Garden', brand: 'Havells', stock: 60,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
        rating: 4.5, numReviews: 789, featured: false
      },
      {
        name: 'Godrej Refrigerator 265L',
        description: 'Frost-free double door refrigerator with inverter compressor, 3-star energy rating, and 10-year warranty.',
        price: 28990, category: 'Home & Garden', brand: 'Godrej', stock: 30,
        images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500'],
        rating: 4.5, numReviews: 456, featured: false
      },
      {
        name: 'Bombay Dyeing Bedsheet Set',
        description: '100% cotton king-size bedsheet with 2 pillow covers. 300 thread count, floral print, easy care.',
        price: 1299, category: 'Home & Garden', brand: 'Bombay Dyeing', stock: 200,
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500'],
        rating: 4.3, numReviews: 1234, featured: false
      },
      {
        name: 'Milton Thermosteel Flask 1L',
        description: 'Double-wall vacuum insulated stainless steel flask. Keeps hot 24 hours, cold 48 hours. Leak-proof.',
        price: 799, category: 'Home & Garden', brand: 'Milton', stock: 300,
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'],
        rating: 4.5, numReviews: 3456, featured: false
      },
      {
        name: 'Pigeon Non-Stick Cookware Set',
        description: '5-piece non-stick cookware set including kadai, tawa, and saucepan. PFOA-free coating, induction compatible.',
        price: 1999, category: 'Home & Garden', brand: 'Pigeon', stock: 120,
        images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'],
        rating: 4.3, numReviews: 2109, featured: false
      },
      {
        name: 'Wipro Smart LED Bulb 9W',
        description: 'Wi-Fi enabled smart LED bulb, 16 million colors, voice control compatible, 25,000 hours lifespan.',
        price: 699, category: 'Home & Garden', brand: 'Wipro', stock: 500,
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'],
        rating: 4.2, numReviews: 1678, featured: false
      },
      {
        name: 'Cello Water Purifier RO+UV',
        description: '7-stage purification, 10L storage, TDS controller, UV sterilization, and mineral enhancer.',
        price: 8499, category: 'Home & Garden', brand: 'Cello', stock: 45,
        images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500'],
        rating: 4.4, numReviews: 567, featured: false
      },
      {
        name: 'Nilkamal Plastic Chair Set of 4',
        description: 'Durable polypropylene chairs with ergonomic design, UV-resistant finish, and stackable for easy storage.',
        price: 2999, category: 'Home & Garden', brand: 'Nilkamal', stock: 80,
        images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'],
        rating: 4.1, numReviews: 892, featured: false
      }
    ];

    let added = 0;
    for (const p of newProducts) {
      const id = uuidv4();
      await db.products.insert({ _id: id, ...p, createdBy: admin._id, createdAt: now, updatedAt: now });
      added++;
      process.stdout.write(`\r📦 Adding products... ${added}/${newProducts.length}`);
    }

    const total = await db.products.count({});
    console.log(`\n\n✅ Added ${added} new products!`);
    console.log(`📊 Total products in store: ${total}`);
    console.log('\nCategory breakdown:');
    const all = await db.products.find({});
    const cats = {};
    all.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
    Object.entries(cats).sort((a,b) => b[1]-a[1]).forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(20)} ${count} products`);
    });
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
};

setTimeout(addProducts, 500);
