require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// ── Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const explorerRoutes = require('./routes/explorers');
const locationRoutes = require('./routes/locations');
const cityRoutes = require('./routes/cities');
const reviewRoutes = require('./routes/reviews');
const videoRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');
const moderateRoutes = require('./routes/moderate');


const app = express();
const PORT = process.env.PORT || 5000;

// ── Database
connectDB();

// ── Security
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

// ── Logging (dev)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static uploads (local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ── Rate limiting
app.use('/api/', apiLimiter);

// ── Health check
app.get('/health', (_req, res) =>
    res.json({ status: 'ok', time: new Date().toISOString() })
);

// ── API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/explorers', explorerRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/moderate', moderateRoutes);


// ── Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`\n🚀 NammaDiscover API → http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});
