const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Models
const MenuItem = require('../src/models/MenuItem');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
const Reservation = require('../src/models/Reservation');
const Registration = require('../src/models/Registration');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/arabic_kitchen', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const menuItems = [
  {
    name: 'Chicken Mandi',
    nameArabic: 'مندي دجاج',
    category: 'mandi',
    description: 'Traditional Yemeni dish consisting of meat and rice with a special blend of spices, cooked in an underground pit.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop', // Replace with an actual image
    isAvailable: true,
    slug: 'chicken-mandi',
    seoTitle: 'Delicious Chicken Mandi - Arabic Kitchen',
    seoDescription: 'Order the best authentic Chicken Mandi in town from Arabic Kitchen.',
  },
  {
    name: 'Mutton Madhabi',
    nameArabic: 'مظبي لحم',
    category: 'mandi',
    description: 'Meat grilled on hot stones over wood fire, served with flavored rice.',
    price: 65,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=1000&auto=format&fit=crop',
    isAvailable: true,
    slug: 'mutton-madhabi',
    seoTitle: 'Authentic Mutton Madhabi - Arabic Kitchen',
    seoDescription: 'Savor the smoky flavor of our Mutton Madhabi. Dine in or order online.',
  },
  {
    name: 'Mixed Grill',
    nameArabic: 'مشاوي مشكلة',
    category: 'grills',
    description: 'A selection of our finest kebabs, shish tawook, and lamb chops, charcoal grilled to perfection.',
    price: 80,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop',
    isAvailable: true,
    slug: 'mixed-grill',
    seoTitle: 'Premium Mixed Grill - Arabic Kitchen',
    seoDescription: 'Enjoy a platter of juicy, charcoal-grilled meats at Arabic Kitchen.',
  },
  {
    name: 'Shish Tawook',
    nameArabic: 'شيش طاووق',
    category: 'grills',
    description: 'Marinated chicken breast skewers grilled over charcoal.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=1000&auto=format&fit=crop',
    isAvailable: true,
    slug: 'shish-tawook',
  },
  {
    name: 'Falafel Wrap',
    nameArabic: 'ساندوتش فلافل',
    category: 'fast-food',
    description: 'Crispy falafel with tahini sauce, fresh vegetables, wrapped in Arabic bread.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?q=80&w=1000&auto=format&fit=crop',
    isAvailable: true,
    slug: 'falafel-wrap',
  },
  {
    name: 'Hummus',
    nameArabic: 'حمص',
    category: 'sides',
    description: 'Creamy puree of chickpeas and tahini flavored with garlic and lemon juice.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?q=80&w=1000&auto=format&fit=crop',
    isAvailable: true,
    slug: 'hummus',
  },
  {
    name: 'Mint Lemonade',
    nameArabic: 'ليمون بالنعناع',
    category: 'beverages',
    description: 'Refreshing drink made with fresh lemon juice and crushed mint leaves.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop',
    isAvailable: true,
    slug: 'mint-lemonade',
  }
];

const users = [
  {
    name: 'System Administrator',
    email: 'admin@arabickitchen.com',
    password: 'admin123456',
    role: 'admin',
    phone: '1234567890',
    employeeId: 'ADMIN001'
  },
  {
    name: 'Staff User',
    email: 'staff@arabickitchen.com',
    password: 'password123',
    role: 'staff',
    phone: '0987654321',
    employeeId: 'EMP001'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
    phone: '5551234567',
  }
];


const importData = async () => {
  try {
    // Clear existing data
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();
    await Reservation.deleteMany();
    await Registration.deleteMany();

    console.log('Data Destroyed...');

    // Hash passwords before inserting (since pre-save hook won't run on insertMany)
    const salt = await bcrypt.genSalt(12);
    const usersWithHashedPasswords = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, salt)
    }));

    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    
    const adminUserId = createdUsers[0]._id;
    const customerId = createdUsers[2]._id;
    const staffId = createdUsers[1]._id;

    const sampleMenuItems = menuItems.map(item => {
      return { ...item, createdBy: adminUserId };
    });

    const createdMenuItems = await MenuItem.insertMany(sampleMenuItems);

    // Create a sample order
    const orderItems = [
      {
        name: createdMenuItems[0].name,
        price: createdMenuItems[0].price,
        quantity: 2,
        image: createdMenuItems[0].image,
        category: createdMenuItems[0].category
      },
      {
        name: createdMenuItems[5].name,
        price: createdMenuItems[5].price,
        quantity: 1,
        image: createdMenuItems[5].image,
        category: createdMenuItems[5].category
      }
    ];

    await Order.create({
      customerId: customerId,
      name: 'John Doe',
      phone: '5551234567',
      address: '123 Main St, Cityville',
      type: 'delivery',
      items: orderItems,
      subtotal: 110,
      deliveryFee: 10,
      total: 120,
      status: 'pending',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending'
    });

    // Create a sample reservation
    await Reservation.create({
      guestName: 'Jane Smith',
      phone: '5559876543',
      partySize: 4,
      reservationDate: new Date(Date.now() + 86400000), // Tomorrow
      reservationTime: '19:00',
      status: 'confirmed',
      handledBy: staffId
    });

    // Create a sample registration
    await Registration.create({
        guestName: 'Walk-in Guest',
        partySize: 2,
        tableNumber: 5,
        status: 'seated',
        registeredBy: staffId
    });


    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
