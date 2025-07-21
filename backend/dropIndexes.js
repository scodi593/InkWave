require('dotenv').config();
const mongoose = require('mongoose');

async function dropIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the collection directly
    const collection = mongoose.connection.collection('blogposts');
    
    // Drop all indexes
    await collection.dropIndexes();
    console.log('Successfully dropped all indexes');

    // List remaining indexes
    const indexes = await collection.listIndexes().toArray();
    console.log('Current indexes:', indexes);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

dropIndexes(); 