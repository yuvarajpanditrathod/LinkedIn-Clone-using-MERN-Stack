const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const connectionRoutes = require('./routes/connections');
const notificationRoutes = require('./routes/notifications');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI;
if (mongoUri) {
  // set a reasonable server selection timeout so failures are noticed quickly during development
  mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      // In production we should exit so the issue is obvious. In development keep the server running
      // so the frontend can load and you can fix .env without the whole process exiting.
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      } else {
        console.warn('Continuing without DB connection — API routes that require DB will fail until a valid MONGODB_URI is provided.');
      }
    });

  // Helpful connection event logging
  mongoose.connection.on('connected', () => console.log('Mongoose connection state: connected'));
  mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err && err.message));
  mongoose.connection.on('disconnected', () => console.warn('Mongoose connection state: disconnected'));
} else {
  console.warn('⚠️  MONGODB_URI not set. Set it in .env (see .env.example). Server will continue but DB features will fail.');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful listen error handling (e.g. EADDRINUSE)
server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. If you're running in a platform/build environment (like Vercel), do not run a long-lived server during the build step. Use the platform's serverless functions or host the API separately.`);
    // In production, exit so the platform/build system knows something is wrong.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  } else {
    console.error('Server error:', err);
    throw err;
  }
});

