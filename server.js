const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Safer CORS config
const allowedOrigins = [
  'https://commacards.com',
  'https://www.commacards.com',
  'http://localhost:3000',
  'https://nfc-frontend-pearl.vercel.app',
  'https://skyblue-pig-834243.hostingersite.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key'], // <-- add this line
};

// ✅ Apply CORS to all requests including preflight
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle OPTIONS before anything else

app.use(express.json());

// Static file serving
console.log('📁 Setting up static file serving for /uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Imports
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const publicProfileRoutes = require('./routes/publicProfile');
const contactRoutes = require('./routes/contact');

// Route Mounting
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/public', publicProfileRoutes);
app.use('/api/contact', contactRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  console.log('📢 Registered backend routes:');
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(handler.route.path);
      }
    });
  }
});
