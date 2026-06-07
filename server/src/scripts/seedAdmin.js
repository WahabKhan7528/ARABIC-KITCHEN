/**
 * Seed script — creates a default admin account if none exists.
 *
 * Usage:
 *   node src/scripts/seedAdmin.js
 *   npm run seed
 *
 * Default credentials (change after first login):
 *   Employee ID: ADMIN001
 *   Password:    admin123456
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_DEFAULTS = {
  employeeId: 'ADMIN001',
  name: 'System Administrator',
  role: 'admin',
  password: 'admin123456',
  phone: '+92 62 0000000',
};

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[seed] Connected to MongoDB.');

    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log(`[seed] Admin account already exists: ${existingAdmin.employeeId} (${existingAdmin.name})`);
      console.log('[seed] Skipping seed. No changes made.');
    } else {
      const admin = await User.create(ADMIN_DEFAULTS);
      console.log('[seed] ✅ Default admin account created successfully:');
      console.log(`       Employee ID : ${admin.employeeId}`);
      console.log(`       Name        : ${admin.name}`);
      console.log(`       Role        : ${admin.role}`);
      console.log('[seed] ⚠️  Change the default password after first login!');
    }

    await mongoose.disconnect();
    console.log('[seed] Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('[seed] Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
