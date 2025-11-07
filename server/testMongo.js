require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
console.log('MONGODB_URI (first 60 chars):', uri ? uri.slice(0,60) + (uri.length>60? '...' : '') : '<<not set>>');

(async () => {
  if (!uri) {
    console.error('No MONGODB_URI found in environment. Ensure server/.env or project .env contains MONGODB_URI.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName: 'admin', serverSelectionTimeoutMS: 10000 });
    console.log('Connected to MongoDB successfully');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection test error:');
    console.error(err);
    process.exit(1);
  }
})();
