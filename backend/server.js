import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analysis.js';

async function startServer() {
  await import('./config/passport.js');

  const app = express();

  connectDB();

  const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map(o => o.trim());
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/auth', authRoutes);
  app.use('/api/analysis', analysisRoutes);

  app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
  });

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('❌ Server startup error:', err);
  process.exit(1);
});
