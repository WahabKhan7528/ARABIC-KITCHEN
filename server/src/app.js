const express = require('express');
const cors = require('cors');
const prerender = require('prerender-node');

const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const itemRoutes = require('./routes/item.routes');
const registrationRoutes = require('./routes/registration.routes');
const reservationRoutes = require('./routes/reservation.routes');
const staffRoutes = require('./routes/staff.routes');
const orderRoutes = require('./routes/order.routes');
const seoRoutes = require('./routes/seo.routes');

const app = express();

// --------------- MIDDLEWARE ---------------

app.use(prerender.set('prerenderToken', process.env.PRERENDER_TOKEN || ''));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://arabic-kitchen-6nv7.vercel.app',
  'https://arabic-kitchen.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (origin && origin.endsWith('.vercel.app')) {
      // Allow any Vercel preview environments
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security Headers
app.use(helmet());

// Prevent NoSQL Injection
app.use(mongoSanitize());

// Request logging
app.use(morgan('dev'));

// --------------- ROUTES ---------------

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'arabic-kitchen-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/users', staffRoutes);
app.use('/api/orders', orderRoutes);

// Base route for SEO (robots.txt, sitemap.xml)
app.use('/', seoRoutes);

// --------------- 404 HANDLER ---------------

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// --------------- GLOBAL ERROR HANDLER ---------------

app.use((err, _req, res, _next) => {
  console.error('[global-error]', err.stack || err.message);

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error.',
  });
});

module.exports = app;
