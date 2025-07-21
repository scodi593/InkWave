require('dotenv').config();
const mongoose = require('mongoose');

async function resetIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Get the BlogPost collection
    const BlogPost = require('../models/BlogPost');
    const collection = BlogPost.collection;

    // Drop all indexes
    await collection.dropIndexes();
    console.log('Dropped all indexes');

    // Create new indexes based on schema
    await BlogPost.init();
    console.log('Created new indexes');

    // List current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetIndexes(); 