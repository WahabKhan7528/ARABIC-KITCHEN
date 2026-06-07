/**
 * Clean DB script — deletes all documents from all collections in the database.
 *
 * Usage:
 *   node src/scripts/cleanDB.js
 *   npm run clean-db
 */

require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDB() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in the environment variables.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('[clean-db] Connected to MongoDB.');

    const collections = await mongoose.connection.db.collections();
    
    if (collections.length === 0) {
      console.log('[clean-db] No collections found. Database is already clean.');
    } else {
      for (let collection of collections) {
        await collection.deleteMany({});
        console.log(`[clean-db] Cleared collection: ${collection.collectionName}`);
      }
      console.log('[clean-db] ✅ Database cleaned successfully.');
    }

    await mongoose.disconnect();
    console.log('[clean-db] Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('[clean-db] Error:', error.message);
    process.exit(1);
  }
}

cleanDB();
