require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const checkItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    const items = await MenuItem.find().sort({ createdAt: -1 });
    console.log('Stored MenuItems:', JSON.stringify(items, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

checkItems();
